
import axios from 'axios';
import * as cheerio from 'cheerio';

async function debugScraper(crm: string, uf: string) {
    const urls = [
        { name: 'CFM', url: `https://portal.cfm.org.br/busca-medicos/?crm=${crm}&uf=${uf}` },
        { name: 'ConsultaCRM', url: `https://www.consultacrm.com.br/${uf.toLowerCase()}/${crm}` }
    ];

    for (const site of urls) {
        console.log(`\n--- Testing ${site.name}: ${site.url} ---`);
        try {
            const response = await axios.get(site.url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                },
                timeout: 10000
            });

            console.log(`Status: ${response.status}`);
            const $ = cheerio.load(response.data);
            
            // Log some structure
            console.log('Title:', $('title').text().trim());
            console.log('H1 first:', $('h1').first().text().trim());
            
            // Check for names in common CRM result classes
            console.log('Possible names found:');
            $('.nome-medico, .card-title, h4.mb-0, .result-item h3').each((i, el) => {
                console.log(`  [${i}] ${$(el).text().trim()}`);
            });
            
            // If it's CFM, they often use a table now
            $('table tr').each((i, el) => {
                if (i < 5) console.log(`  TR[${i}]: ${$(el).text().replace(/\s+/g, ' ').trim()}`);
            });

        } catch (e: any) {
            console.error(`Error ${site.name}: ${e.message}`);
            if (e.response) {
                console.log(`Response Status: ${e.response.status}`);
            }
        }
    }
}

debugScraper('24298', 'SP');
