import { getSecmeliDersler, getGradeRange, getGradeRangeForOkulTipi, getKademeTiles } from './src/data/secmeliDersler';

const slugs = [
  'turkce', 'turk_dili_ve_edebiyati', 'matematik', 'fen_bilimleri', 'sosyal_bilgiler',
  'tarih', 'cografya', 'felsefe', 'fizik', 'kimya', 'biyoloji', 'ingilizce', 'dkab',
  'ihl_meslek_dersleri', 'gorsel_sanatlar', 'muzik', 'beden_egitimi',
  'bilisim_teknolojileri', 'sinif_ogretmeni', 'teknoloji_tasarim', 'almanca',
  'fransizca', 'arapca',
];

for (const slug of slugs) {
  const tiles = getKademeTiles(slug);
  const found = new Map<string, string[]>();
  if (tiles.length > 1) {
    // Gercek SinifScreen akisi: kullanici bir tile secer, o tile'in okulTipi'siyle DerslerScreen'e gecilir.
    for (const t of tiles) {
      const siniflar = getGradeRangeForOkulTipi(slug, t.okulTipi);
      const secmeli = getSecmeliDersler(slug, siniflar, t.okulTipi);
      secmeli.forEach(d => {
        if (!found.has(d.ad)) found.set(d.ad, []);
        found.get(d.ad)!.push(t.okulTipi);
      });
    }
  } else {
    // Tek kademe: SinifScreen selectedOkulTipi'yi HIC set etmiyor -> context okulTipi ''
    // -> DerslerScreen'de okulTipi||undefined -> undefined -> okul_tipi filtresi devre disi.
    const siniflar = getGradeRange(slug);
    const secmeli = getSecmeliDersler(slug, siniflar, undefined);
    secmeli.forEach(d => {
      if (!found.has(d.ad)) found.set(d.ad, []);
      found.get(d.ad)!.push('(okulTipi=undefined)');
    });
  }
  if (found.size > 0) {
    console.log(slug + ':');
    for (const [ad, ots] of found) console.log('  -', ad, '[' + [...new Set(ots)].join(',') + ']');
  }
}
