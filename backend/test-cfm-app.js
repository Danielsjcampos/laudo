
const axios = require('axios');

async function testCFMApp() {
  try {
    const response = await axios.post('https://app.cfm.org.br/api/v1/medicos/buscar', {
      crm: '240110',
      uf: 'SP'
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'CFM/1.0 (Android; 10; Scale/2.0)'
      },
      timeout: 10000
    });

    console.log('Response Status:', response.status);
    console.log('Response Data:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    if (error.response) {
      console.log('Error Status:', error.response.status);
      console.log('Error Data:', error.response.data);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testCFMApp();
