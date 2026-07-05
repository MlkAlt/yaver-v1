/*
 * extract-rehberlik-etkinlik.cjs
 * -------------------------------------------------------------------------
 * ORGM sınıf rehberlik etkinlik kitaplarından (PDF) her etkinliğin
 *   { sinif, hafta, yeterlikAlani, kazanim, etkinlikAdi, page }
 * bilgisini çıkarır ve JSON olarak yazar.
 *
 * NEDEN pdfjs-dist: poppler/pdftotext Türkçe karakterleri (ş,ğ,ı,ü,ö,ç)
 * bozuyor. pdfjs-dist metni transform koordinatlarıyla doğru veriyor.
 *
 * BAĞIMLILIK: pdfjs-dist (legacy build). Kuruluysa projeden, değilse
 * NODE_PATH ile gösterilen bir node_modules'tan çözülür:
 *   NODE_PATH=/path/to/node_modules node scripts/extract-rehberlik-etkinlik.cjs <pdf> [out.json]
 *
 * KULLANIM:
 *   node scripts/extract-rehberlik-etkinlik.cjs "<pdf yolu>" [cikti.json]
 *
 * SAYFA YAPISI (iki layout, tek mantıkla ele alınır):
 *   - Sol sütunda etiketler: "Gelişim Alanı", "Yeterlik Alanı",
 *     "Kazanım/Hafta", "Sınıf Düzeyi", "Süre" (+ ciltlerde "Etkinliğin Adı:")
 *   - Değerler etiketin sağında (x daha büyük), aynı satırda (±6pt).
 *   - Gerçek etkinlik sayfası ayırt edici: "Sınıf Düzeyi" değeri /\d+\. Sınıf/.
 *   - Etkinlik adı: ciltlerde "Etkinliğin Adı:" etiketinin değeri;
 *     11. sınıf tek-kitabında tablonun üstünde serbest BÜYÜK HARF başlık.
 */
'use strict';
const fs = require('fs');
const path = require('path');

function norm(s) { return (s || '').replace(/\s+/g, ' ').trim(); }

// Bir etiket satırının değerini oku. Değerler sağ sütunda (x>label.x+60) ve
// KENDİ etiket satırlarına DİKEY OLARAK ORTALANMIŞ durur; yani 2-3 satırlık bir
// değer, etiketin hem üstüne hem altına taşabilir. Bu yüzden her sağ-sütun
// satırını "en yakın etikete" atarız (labelYs: tüm etiketlerin y'leri).
function readValue(items, label, labelYs) {
  const lx = label.transform[4];
  const ly = label.transform[5];
  const nearestY = (y) => labelYs.reduce((a, b) => (Math.abs(b - y) < Math.abs(a - y) ? b : a), labelYs[0]);
  const vals = items
    .filter((i) => i.transform[4] > lx + 60)
    .filter((i) => nearestY(i.transform[5]) === ly)
    .sort((a, b) => (b.transform[5] - a.transform[5]) || (a.transform[4] - b.transform[4]));
  return norm(vals.map((i) => i.str).join(' '));
}

// Etkinlik adı gibi TEK SATIRLIK değerler için: sadece etiketle aynı satır
// (±8pt). Dekoratif kitaplarda tablonun üstünde başlık bandı olduğundan
// nearest-label kümesi kirlenir; aynı-satır kısıtı temiz adı verir.
function readValueSameRow(items, label) {
  const vals = items
    .filter((i) => i.transform[4] > label.transform[4] + 60)
    .filter((i) => Math.abs(i.transform[5] - label.transform[5]) <= 8)
    .sort((a, b) => a.transform[4] - b.transform[4]);
  return norm(vals.map((i) => i.str).join(' '));
}

// Harf aralıklı (letter-spaced) BÜYÜK HARF başlıklarda her glif ayrı item
// olarak gelir ve boşlukla birleştirmek "B İ L" gibi bozuk sonuç verir.
// item.width ile yatay boşluğu ölçüp bitişik glifleri boşluksuz birleştir.
function joinByGap(items) {
  const sorted = items.slice().sort((a, b) =>
    (b.transform[5] - a.transform[5]) || (a.transform[4] - b.transform[4]));
  // satırlara göre grupla (dy < 4 aynı satır)
  const lines = [];
  for (const it of sorted) {
    const last = lines[lines.length - 1];
    if (last && Math.abs(last.y - it.transform[5]) < 4) last.items.push(it);
    else lines.push({ y: it.transform[5], items: [it] });
  }
  const lineStr = lines.map((ln) => {
    const its = ln.items.slice().sort((a, b) => a.transform[4] - b.transform[4]);
    let s = '';
    let prevEnd = null;
    for (const it of its) {
      const x = it.transform[4];
      if (prevEnd !== null) s += (x - prevEnd > 1.5) ? ' ' : '';
      s += it.str;
      prevEnd = x + (it.width || 0);
    }
    return s;
  });
  return norm(lineStr.join(' '));
}

async function loadPdfjs() {
  try {
    return await import('pdfjs-dist/legacy/build/pdf.mjs');
  } catch (e) {
    // Proje bağımlılığı yoksa PDFJS_DIR (node_modules yolu) üzerinden çöz
    if (!process.env.PDFJS_DIR) throw e;
    const { pathToFileURL } = require('url');
    const p = path.join(process.env.PDFJS_DIR, 'pdfjs-dist', 'legacy', 'build', 'pdf.mjs');
    return await import(pathToFileURL(p).href);
  }
}

async function extract(pdfPath) {
  const pdfjsLib = await loadPdfjs();
  const data = new Uint8Array(fs.readFileSync(pdfPath));
  const doc = await pdfjsLib.getDocument({ data, verbosity: 0 }).promise;
  const out = [];
  for (let p = 1; p <= doc.numPages; p++) {
    const page = await doc.getPage(p);
    const content = await page.getTextContent();
    const items = content.items.filter((i) => i.str && i.str.trim());

    const find = (re) => items.find((i) => re.test(norm(i.str)));
    const lblGelisim = find(/^Gelişim Alan/i);
    const lblYeterlik = find(/^Yeterli.*Alan/i);
    const lblKazanim = find(/^Kazanım/i);
    const lblSinif = find(/^Sınıf Düzeyi/i);
    if (!lblGelisim || !lblYeterlik || !lblKazanim || !lblSinif) continue;

    // Etiket y-değerleri (değer bölgesi sınırları için)
    const labelYs = items
      .filter((i) => /^(Gelişim Alan|Yeterli.*Alan|Kazanım|Sınıf Düzeyi|Süre|Araç|Etkinliğin Adı|Uygulayıcı|Süreç)/i.test(norm(i.str)))
      .map((i) => i.transform[5]);

    const sinifVal = readValue(items, lblSinif, labelYs);
    const mS = sinifVal.match(/(\d+)\s*\.\s*S[ıi]n[ıi]f/i);
    if (!mS) continue; // gerçek etkinlik sayfası değil (örnek/açıklama sayfası)
    const sinif = parseInt(mS[1], 10);

    const yeterlikAlani = readValue(items, lblYeterlik, labelYs);
    let kazanimRaw = readValue(items, lblKazanim, labelYs);
    // "... / N.Hafta" veya "... /N. Hafta" ayrıştır
    let hafta = null;
    let kazanim = kazanimRaw;
    const mH = kazanimRaw.match(/^(.*?)[\/]\s*(\d+)\s*\.?\s*Hafta\b/i);
    if (mH) { kazanim = norm(mH[1]); hafta = parseInt(mH[2], 10); }

    // Etkinlik adı
    let etkinlikAdi = '';
    const lblEtkAdi = find(/^Etkinliğin Adı/i);
    const hasEtkinlikAdiLabel = !!lblEtkAdi;
    if (lblEtkAdi) {
      etkinlikAdi = readValueSameRow(items, lblEtkAdi);
    } else {
      // Tablonun üstündeki serbest başlık (11. sınıf kitabı)
      const gY = lblGelisim.transform[5];
      const cands = items
        .filter((i) => i.transform[5] > gY + 5 && i.transform[5] < gY + 130)
        .filter((i) => {
          const s = norm(i.str);
          return !/\d+\s*\.?\s*HAFTA/i.test(s) &&
                 !/SINIF\s+ETKİNLİKLER/i.test(s) &&
                 !/^\d+$/.test(s);
        })
        .sort((a, b) => (b.transform[5] - a.transform[5]) || (a.transform[4] - b.transform[4]));
      etkinlikAdi = joinByGap(cands);
    }
    // Artık kalmış "N HAFTA" / "SINIF ETKİNLİKLERİ" ön eklerini temizle
    etkinlikAdi = norm(etkinlikAdi
      .replace(/^\d+\s*\.?\s*HAFTA\b/i, '')
      .replace(/\d+\.?\s*SINIF\s+ETKİNLİKLERİ/i, ''));

    out.push({
      page: p,
      sinif,
      hafta,
      yeterlikAlani,
      kazanim,
      etkinlikAdi,
      hasEtkinlikAdiLabel,
    });
  }
  return out;
}

async function main() {
  const pdfPath = process.argv[2];
  const outPath = process.argv[3];
  if (!pdfPath) {
    console.error('Kullanım: node scripts/extract-rehberlik-etkinlik.cjs "<pdf>" [cikti.json]');
    process.exit(1);
  }
  const rows = await extract(pdfPath);
  const json = JSON.stringify(rows, null, 2);
  if (outPath) fs.writeFileSync(outPath, json);
  console.error(`${path.basename(pdfPath)}: ${rows.length} etkinlik çıkarıldı`);
  if (!outPath) console.log(json);
}

main().catch((e) => { console.error(e); process.exit(1); });
