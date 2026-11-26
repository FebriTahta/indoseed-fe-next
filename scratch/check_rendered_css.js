const http = require('http');

function fetchFollow(urlStr) {
  return new Promise((resolve, reject) => {
    http.get(urlStr, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        const nextUrl = res.headers.location.startsWith('http') 
          ? res.headers.location 
          : `http://localhost:3000${res.headers.location}`;
        console.log(`Redirecting (${res.statusCode}) to:`, nextUrl);
        return resolve(fetchFollow(nextUrl));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function run() {
  const page = await fetchFollow('http://localhost:3000/produksi/jadwaltanam');
  console.log('Final Page Status:', page.status);
  const cssLinks = [];
  const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]*href=["']([^"']+)["']/g;
  let match;
  while ((match = linkRegex.exec(page.data)) !== null) {
    cssLinks.push(match[1]);
  }
  console.log('CSS links found:', cssLinks);

  for (const link of cssLinks) {
    const url = link.startsWith('http') ? link : `http://localhost:3000${link}`;
    const cssRes = await fetchFollow(url);
    const css = cssRes.data;
    console.log(`\n--- CSS from ${link} (length: ${css.length}) ---`);
    console.log('Has z-[9999]:', css.includes('9999'));
    console.log('Has #078836:', css.includes('078836'));
    console.log('Has rounded-xl:', css.includes('rounded-xl'));
    console.log('Has rounded-2xl:', css.includes('rounded-2xl'));
    console.log('Has shadow-2xl:', css.includes('shadow-2xl'));
    console.log('Has bg-[#078836]:', css.includes('078836'));
  }
}

run().catch(console.error);
