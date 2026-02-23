
import { CRMService } from './src/services/crmService';
import dotenv from 'dotenv';
dotenv.config();

/**
 * CRM VERIFICATION TEST TOOL
 * Usage: node verify-test.js <CRM> <UF>
 */
async function run() {
  const crm = process.argv[2] || '240110';
  const uf = process.argv[3] || 'SP';

  console.log(`\n🔍 Testando Verificação de CRM: ${crm}-${uf}`);
  console.log('-------------------------------------------');

  try {
    const start = Date.now();
    const result = await CRMService.verify(crm, uf);
    const end = Date.now();

    if (result) {
      console.log('✅ RESULTADO LOCALIZADO:');
      console.log(`👤 Nome: ${result.name}`);
      console.log(`🩺 Especialidade: ${result.specialty}`);
      console.log(`📊 Status: ${result.status}`);
      console.log(`📡 Origem: ${result.source}`);
      console.log(`⏱️  Tempo: ${end - start}ms`);
    } else {
      console.log('❌ CRM não localizado nas bases oficiais ou locais.');
    }
  } catch (error: any) {
    console.error('💥 Erro durante a verificação:', error.message);
  }
  console.log('-------------------------------------------\n');
  process.exit(0);
}

run();
