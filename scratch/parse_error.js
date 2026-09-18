const fs = require('fs');
const html = fs.readFileSync('scratch/error.html', 'utf8');

// Look for error clues
const m1 = html.match(/<pre[^>]*>([\s\S]*?)<\/pre>/i);
if (m1) console.log('PRE:', m1[1]);

const m2 = html.match(/"digest":\s*"([^"]+)"/);
if (m2) console.log('Digest:', m2[1]);

const m3 = html.match(/"message":\s*"([^"]+)"/);
if (m3) console.log('Message:', m3[1]);

// Search for any stack trace or error keywords
const lines = html.split('\n');
lines.forEach(l => {
  if (l.toLowerCase().includes('error') && !l.includes('typeof') && !l.includes('Error(')) {
    console.log('Line:', l.slice(0, 150));
  }
});
