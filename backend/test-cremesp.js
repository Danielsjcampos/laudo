
const axios = require('axios');

async function testCremesp() {
  try {
    const response = await axios.post('https://guiamedico.cremesp.org.br/api/GuiaMedico/Pesquisar', {
      Nome: "",
      Crm: "240110",
      Uf: "SP",
      Cidade: "",
      Especialidade: "",
      Status: "",
      Pagina: 1
    }, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Referer': 'https://guiamedico.cremesp.org.br/'
      }
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

testCremesp();
