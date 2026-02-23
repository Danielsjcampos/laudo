
const axios = require('axios');
const cheerio = require('cheerio');

async function testConsultaCRM() {
  try {
    const url = 'https://www.consultacrm.com.br/sp/240110';
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      }
    });

    const $ = cheerio.load(response.data);
    const name = $('h1').first().text().trim();
    console.log('Name found:', name);
    console.log('HTML Length:', response.data.length);
  } catch (error) {
    if (error.response) {
      console.log('Error Status:', error.response.status);
    } else {
      console.log('Error:', error.message);
    }
  }
}

testConsultaCRM();
