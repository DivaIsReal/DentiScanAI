const fs = require('fs');
const https = require('https');

function readEnvKey(path) {
  try {
    const txt = fs.readFileSync(path, 'utf8');
    const m = txt.match(/^\s*GEMINI_API_KEY\s*=\s*(.+)\s*$/m);
    if (!m) return null;
    return m[1].trim();
  } catch (e) {
    return null;
  }
}

const key = readEnvKey('.env.local') || process.env.GEMINI_API_KEY;
if (!key) {
  console.error('No GEMINI_API_KEY found in .env.local or environment');
  process.exit(2);
}

const url = 'https://generativelanguage.googleapis.com/v1beta/models?key=' + encodeURIComponent(key);

https.get(url, (res) => {
  let data = '';
  res.on('data', (c) => (data += c));
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(JSON.stringify(json, null, 2));
    } catch (e) {
      console.error('Failed to parse response as JSON');
      console.error(data);
      process.exit(3);
    }
  });
}).on('error', (err) => {
  console.error('Request error:', err.message || err);
  process.exit(4);
});
