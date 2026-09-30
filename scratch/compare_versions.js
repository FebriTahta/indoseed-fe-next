const fs = require('fs');
const lines = fs.readFileSync('C:/Users/lenovo/.gemini/antigravity-ide/brain/1a784eb3-92b8-43d1-bca6-c1f3614ca949/.system_generated/logs/transcript.jsonl', 'utf8').split('\n');

const step652 = JSON.parse(lines[652]);
const content652 = step652.tool_calls[0].args.CodeContent;

const step858 = JSON.parse(lines[856]);
const content858 = step858.tool_calls[0].args.CodeContent;

console.log('Length 652:', content652.length);
console.log('Length 858:', content858.length);

// Compare differences
const lines652 = content652.split('\n');
const lines858 = content858.split('\n');
console.log('Lines 652:', lines652.length, 'Lines 858:', lines858.length);
