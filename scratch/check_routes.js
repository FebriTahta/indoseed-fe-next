const http = require('http');

const urls = [
  'http://localhost:3000/produksi/jadwaltanam',
  'http://localhost:3000/produksi/jadwaltanam/create',
];

function checkUrl(url) {
  return new Promise((resolve) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ url, status: res.statusCode, length: data.length, isRedirect: res.statusCode >= 300 && res.statusCode < 400 });
      });
    }).on('error', (err) => {
      resolve({ url, error: err.message });
    });
  });
}

async function main() {
  for (const u of urls) {
    const res = await checkUrl(u);
    console.log(res);
  }
}

main();
