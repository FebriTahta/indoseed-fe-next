const fs = require('fs');
const content = fs.readFileSync('./app/(components)/(content-layout)/produksi/jadwaltanam/component/ModalRevisiJadwal.tsx', 'utf8');
const classes = new Set();
const regex = /className=["'`]([^"'`]+)["'`]/g;
let match;
while ((match = regex.exec(content)) !== null) {
  match[1].split(/\s+/).forEach(c => {
    // ignore dynamic string interpolation like ${...}
    if (c.includes('{') || c.includes('}')) return;
    if (c.trim()) classes.add(c.trim());
  });
}
console.log('Total unique classes:', classes.size);
console.log(JSON.stringify(Array.from(classes).sort(), null, 2));
