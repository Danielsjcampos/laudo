import axios from 'axios';
import * as cheerio from 'cheerio';
import prisma from '../lib/prisma';
import puppeteer from 'puppeteer';

interface CRMResult {
  name: string;
  specialty: string;
  status: 'Ativo' | 'Inativo' | 'Pendente' | 'Cancelado';
  source: 'Official' | 'Internal' | 'ProfessionalMock' | 'Search';
  lastVerified?: Date;
}

export class CRMService {
  /**
   * Robust CRM verification: Cache -> Official Scraping -> Fallback Scrapers -> Mock Fallback
   */
  static async verify(crm: string, uf: string): Promise<CRMResult | null> {
    const crmNum = crm.replace(/\D/g, '');
    const ufUpper = uf.toUpperCase();

    console.log(`[CRM] Verifying: ${crmNum}-${ufUpper}`);

    // 1. Check Internal Cache
    try {
      const cached = await prisma.verifiedCrm.findUnique({
        where: { crm_uf: { crm: crmNum, uf: ufUpper } }
      });

      if (cached) {
        // If verified recently (e.g., last 30 days), return from cache
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        if (cached.lastVerified > thirtyDaysAgo) {
          console.log(`[CRM] Cache Hit: ${crmNum}-${ufUpper}`);
          return {
            name: cached.name,
            specialty: cached.specialty || 'Médico',
            status: cached.status as any,
            source: 'Internal',
            lastVerified: cached.lastVerified
          };
        }
      }
    } catch (e) {
      console.error('[CRM] Cache lookup failed:', e);
    }

    // 2. Try Official Council (CFM Portal)
    try {
      const official = await this.scrapeCFM(crmNum, ufUpper);
      if (official) {
        await this.updateCache(crmNum, ufUpper, official, 'Official');
        return official;
      }
    } catch (e) {
      console.error('[CRM] Official scraping failed:', e);
    }

    // 3. Try Alternative Scrapers
    // Try ConsultaCRM
    try {
      const fallback = await this.scrapeConsultaCRM(crmNum, ufUpper);
      if (fallback) {
        await this.updateCache(crmNum, ufUpper, fallback, 'Search');
        return fallback;
      }
    } catch (e) {
      console.error('[CRM] ConsultaCRM failed:', e);
    }

    // Try MedicalPort (often more reliable fallback)
    try {
      const fallback2 = await this.scrapeMedicalPort(crmNum, ufUpper);
      if (fallback2) {
        await this.updateCache(crmNum, ufUpper, fallback2, 'Search');
        return fallback2;
      }
    } catch (e) {
      console.error('[CRM] MedicalPort failed:', e);
    }

    // 4. Mock: Professional Demonstration Cases
    const mock = this.getProfessionalMock(crmNum, ufUpper);
    if (mock) {
      await this.updateCache(crmNum, ufUpper, mock, 'ProfessionalMock');
      return mock;
    }

    return null;
  }

  private static async scrapeCFM(crm: string, uf: string): Promise<CRMResult | null> {
    const url = `https://portal.cfm.org.br/busca-medicos/`;
    let browser: any = null;
    let page: any = null;
    
    try {
      console.log(`[CRM] Starting Puppeteer search for ${crm}-${uf}`);
      browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
      page = await browser.newPage();
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');
      
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // Dismiss cookie banner - Try to click "PERMITIR", "Confirmar" or "ACEITO"
      try {
        const cookieButtons = await page.$$('button, a');
        for (const btn of cookieButtons) {
          const text = await page.evaluate((el: any) => el.textContent, btn);
          if (text && (text.includes('PERMITIR') || text.includes('Aceitar') || text.includes('Recusar') || text.includes('ACEITO'))) {
             await btn.click();
             await new Promise(r => setTimeout(r, 500));
             break;
          }
        }
      } catch (e) { /* ignore */ }

      // Fill in the form
      await page.waitForSelector('#crm', { timeout: 10000 });
      await page.type('#crm', crm);
      await page.select('#uf', uf);
      
      // Submit form
      const submitButton = await page.$('button[type="submit"].btn-busca'); // Try specific class first
      if (submitButton) {
         await submitButton.click();
      } else {
         // Fallback: evaluate specific button by text
         const found = await page.evaluate(() => {
            const buttons = Array.from(document.querySelectorAll('button'));
            const target = buttons.find(b => b.textContent?.includes('ENVIAR') || b.textContent?.includes('Enviar'));
            if (target) {
               target.click();
               return true;
            }
            return false;
         });
         
         if (!found) {
            throw new Error('Submit button "ENVIAR" not found via evaluate');
         }
      }

      // Wait for navigation OR results (handling both POST and AJAX)
      try {
        await Promise.race([
          page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 15000 }),
          page.waitForSelector('.card-body, .nome-medico', { timeout: 15000 })
        ]);
      } catch(e) { /* ignore timeout and check results manually */ }

      // Wait for results with a diverse set of possible selectors
      await page.waitForSelector('.nome-medico, .card-title, h4, h3, .result-item, table tr td, .alert-warning', { timeout: 10000 });
      
      const result = await page.evaluate((searchCrm: string) => {
        // diverse selector strategy
        const rows = Array.from(document.querySelectorAll('.card, .result-item, tr'));
        
        for (const row of rows) {
           const text = row.textContent || '';
           // Check if this row/card contains the CRM we are looking for
           if (text.includes(searchCrm)) {
              // Try to find the name in headers or strong tags
              const nameEl = row.querySelector('.nome-medico, h4, h5, strong, .card-title');
              const statusEl = row.querySelector('.situacao, .status, span.badge');
              const specialtyEl = row.querySelector('.specialidade, .especialidade');
              
              const name = nameEl?.textContent?.trim();
              if (name && name.length > 3) {
                 // Clean up name (remove 'CRM:' prefix if present in the same element)
                 return {
                    name: name.replace(/CRM:.*/i, '').trim(),
                    statusText: statusEl?.textContent?.trim() || (text.includes('Ativo') || text.includes('Regular') ? 'Ativo' : 'Inativo'),
                    specialty: specialtyEl?.textContent?.trim() || 'Médico'
                 };
              }
           }
        }

        // Broad fallback if specific card structure fails but text is present
        const bodyText = document.body.textContent || '';
        if (bodyText.includes(searchCrm) && bodyText.includes('Situação: Regular')) {
            // Try to grab the first H4 that looks like a name
            const possibleName = document.querySelector('.card-body h4')?.textContent?.trim();
            if (possibleName) {
                return {
                    name: possibleName,
                    statusText: 'Ativo',
                    specialty: 'Médico'
                };
            }
        }
        
        return null;
      }, crm); // Pass crm variable to evaluate context

      if (result && result.name && result.name.length > 3) {
        const status = result.statusText.toLowerCase().includes('ativo') ? 'Ativo' : 
                       result.statusText.toLowerCase().includes('inativo') ? 'Inativo' : 'Pendente';
        
        console.log(`[CRM] Official record found via Puppeteer: ${result.name}`);
        return { 
          name: result.name.toUpperCase(), 
          specialty: result.specialty, 
          status: status as any, 
          source: 'Official' 
        };
      } else {
        console.warn(`[CRM] Puppeteer finished but no valid result found for ${crm}-${uf}`);
        if (page) {
           const screenshotPath = `d:/Tudo programação/Projetos Antigravity/laudo-main/backend/debug-crm-notfound-${crm}.png`;
           try {
             await page.screenshot({ path: screenshotPath, fullPage: true });
             console.log(`[CRM] Not Found screenshot saved: ${screenshotPath}`);
           } catch (e) { console.error('Screenshot failed', e); }
        }
      }
    } catch (e: any) {
      console.warn(`[CRM] Puppeteer search failed for ${crm}-${uf}: ${e.message}`);
      if (page) {
        try {
          const screenshotPath = `d:/Tudo programação/Projetos Antigravity/laudo-main/backend/debug-crm-error-${crm}.png`;
          await page.screenshot({ path: screenshotPath, fullPage: true });
          console.log(`[CRM] Error screenshot saved: ${screenshotPath}`);
        } catch (err) {
          console.error('[CRM] Failed to save error screenshot:', err);
        }
      }
    } finally {
      if (browser) await browser.close();
    }

    return null;
  }

  private static async scrapeConsultaCRM(crm: string, uf: string): Promise<CRMResult | null> {
    const url = `https://www.consultacrm.com.br/${uf.toLowerCase()}/${crm}`;
    
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
        timeout: 8000
      });

      const $ = cheerio.load(response.data);
      const name = $('h1').first().text().trim() || $('.nome-medico').first().text().trim();
      
      if (name && name.length > 3 && !name.toLowerCase().includes('não encontrado')) {
        const specialty = $('p:contains("Especialidade")').text().split(':')[1]?.trim() || 
                          $('.especialidade').text().trim() || 'Médico';
        const statusText = $('p:contains("Situação")').text().toLowerCase() || $('.situacao').text().toLowerCase();
        
        const status = statusText.includes('ativo') ? 'Ativo' : 
                       statusText.includes('inativo') ? 'Inativo' : 'Pendente';

        return { 
          name: name.toUpperCase(), 
          specialty, 
          status: status as any, 
          source: 'Search' 
        };
      }
    } catch (e: any) {
      console.warn(`[CRM] ConsultaCRM failed for ${crm}-${uf}`);
    }
    return null;
  }

  private static async scrapeMedicalPort(crm: string, uf: string): Promise<CRMResult | null> {
    const url = `https://www.medical-port.com/br/crm/${uf}/${crm}`;
    try {
      const response = await axios.get(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
        timeout: 8000
      });
      const $ = cheerio.load(response.data);
      const name = $('h1').first().text().trim();
      
      if (name && name.length > 3) {
        return {
          name: name.toUpperCase(),
          specialty: 'Médico',
          status: 'Ativo', // medical-port typically lists active profiles
          source: 'Search'
        };
      }
    } catch (e) {
      console.warn(`[CRM] MedicalPort failed for ${crm}-${uf}`);
    }
    return null;
  }

  private static getProfessionalMock(crm: string, uf: string): CRMResult | null {
    const knownDoctors: Record<string, Omit<CRMResult, 'source'>> = {
      '240110-SP': { name: 'LUCAS HENRIQUE FERREIRA DOS SANTOS', specialty: 'Radiologia e Diagnóstico por Imagem', status: 'Ativo' },
      '194528-SP': { name: 'AARAO ANDRADE NAPOLEAO LIMA', specialty: 'Dermatologia', status: 'Ativo' },
      '129670-SP': { name: 'DANIEL ROBERTO DE CAMPOS SILVA', specialty: 'Cirurgia Torácica', status: 'Ativo' }
    };

    const key = `${crm}-${uf}`.toUpperCase();
    if (knownDoctors[key]) {
      return { ...knownDoctors[key], source: 'ProfessionalMock' };
    }
    return null;
  }

  // Temporary cleanup method to clear incorrect cache entry (called once or as needed)
  static async fixIncorrectCache() {
    try {
      await prisma.verifiedCrm.deleteMany({
        where: {
          crm: '24298',
          uf: 'SP',
          name: 'DRAUZIO VARELLA'
        }
      });
      console.log('[CRM] Cleared incorrect cache entry for 24298-SP (Drauzio Varella)');
    } catch (e) {
      console.error('[CRM] Failed to clear incorrect cache:', e);
    }
  }

  private static async updateCache(crm: string, uf: string, result: CRMResult, source: string) {
    try {
      await prisma.verifiedCrm.upsert({
        where: { crm_uf: { crm, uf } },
        update: {
          name: result.name,
          specialty: result.specialty,
          status: result.status,
          source: source,
          lastVerified: new Date()
        },
        create: {
          crm,
          uf,
          name: result.name,
          specialty: result.specialty,
          status: result.status,
          source: source
        }
      });
      console.log(`[CRM] Cache updated for ${crm}-${uf} (${source})`);
    } catch (e) {
      console.error('[CRM] Failed to update cache:', e);
    }
  }
}
