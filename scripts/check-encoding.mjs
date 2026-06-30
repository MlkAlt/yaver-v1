// Encoding tespiti
import fs from 'fs';
import path from 'path';

const dir = path.join(process.cwd(), 'yeniders');

// Orijinal dosyayı binary olarak oku
const rawBuf = fs.readFileSync(path.join(dir, 'almanca_lise_v2.json'));

// İlk 500 byte'ı hex olarak göster
console.log('İlk 500 byte (hex):\n', rawBuf.slice(0, 500).toString('hex'));
console.log('\n---');

// UTF-8 olarak parse et ve ilk kayıt ad değerinin byte'larına bak
const data = JSON.parse(rawBuf.toString('utf8'));
const ad0 = data[0].ad;
console.log(`\nAd[0]: "${ad0}"`);
console.log('Ad[0] char codes:');
for (let i = 0; i < Math.min(ad0.length, 50); i++) {
  const cp = ad0.charCodeAt(i);
  if (cp > 127) {
    process.stdout.write(`[U+${cp.toString(16).toUpperCase().padStart(4,'0')} '${ad0[i]}'] `);
  } else {
    process.stdout.write(ad0[i]);
  }
}
console.log('\n');

// Latin-1 fix dene
try {
  const fixed = Buffer.from(ad0, 'latin1').toString('utf8');
  console.log(`Latin-1→UTF-8 fix: "${fixed}"`);
} catch(e) {
  console.log('Latin-1 fix başarısız:', e.message);
}

// Windows-1252 denemesi
const mapping = {'Ã¤':'ä','Ã¶':'ö','Ã¼':'ü','Ã„':'Ä','Ã–':'Ö','Ãœ':'Ü','ÃŸ':'ß','Ä±':'ı','Ä°':'İ','Å\x9F':'ş','Å\x9E':'Ş','Ã§':'ç','Ã‡':'Ç','Ã¢':'â'};
let fixed2 = ad0;
for (const [from, to] of Object.entries(mapping)) fixed2 = fixed2.replaceAll(from, to);
console.log(`String replace fix: "${fixed2}"`);
