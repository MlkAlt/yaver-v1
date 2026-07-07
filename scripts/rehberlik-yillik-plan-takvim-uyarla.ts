/*
 * rehberlik-yillik-plan-takvim-uyarla.ts
 * -------------------------------------------------------------------------
 * Rehberlik Yıllık Planı'nın (src/data/rehberlikYillikPlanlari.ts) ay/hafta/tarih
 * alanlarını GERÇEK eğitim takvimine (src/data/egitimTakvimi2025.ts) göre yeniden
 * hesaplar. Her sınıfın kazanım sırası, takvimin aktif (tatil olmayan) haftalarına
 * baştan sona, atlamadan, kesintisiz yerleştirilir — bir ayın taşan son kazanımı
 * otomatik olarak bir sonraki ayın ilk gerçek haftasına kayar (1 hafta = 1 kazanım
 * kuralı hep korunur). Tatil satırları (ARA TATİL/YARIYIL TATİLİ/RİBA) aynı şekilde
 * takvimin gerçek tatil haftalarına sırayla eşlenir.
 *
 * NEDEN GEREKLİ: Okul takvimi her yıl değişir (tatiller farklı haftalara denk gelir,
 * bazı ayların gerçek hafta sayısı değişir). Kazanım içeriği (metin/etkinlikAdi/
 * yeterlikAlani) sabit kalır ama ay/hafta/tarih her yıl yeniden hesaplanmalı.
 *
 * KULLANIM (yeni eğitim-öğretim yılına geçerken):
 *   1. src/data/egitimTakvimi2025.ts'i yeni yılın gerçek MEB çalışma takvimiyle
 *      güncelle (veya yeni bir egitimTakvimiYYYY.ts oluşturup bu script'in importunu
 *      ona yönlendir).
 *   2. npx tsx scripts/rehberlik-yillik-plan-takvim-uyarla.ts
 *   3. npx tsc --noEmit ile doğrula, birkaç sınıfı gözle kontrol et.
 *
 * NOT: İdari (takdire bağlı zamanlı — Veli Toplantısı, Bilgi Fişleri vb.) satırlar
 * zaten kalıcı olarak kaldırılmıştır (2026-07-07 kararı); bu script onları tekrar
 * üretmez, sadece etkinlikNo!=null (kazanım) ve tatil:true satırları işler.
 */
import * as fs from 'fs';
import { REHBERLIK_YILLIK_PLAN, RehberlikPlanHaftasi } from '../src/data/rehberlikYillikPlanlari';
import { EGITIM_TAKVIMI, AKTIF_HAFTALAR, haftanınAyAdi, haftaTarihMetni } from '../src/data/egitimTakvimi2025';

const TATIL_HAFTALARI = EGITIM_TAKVIMI.filter(h => h.tatilMi);

console.log(`Aktif hafta (tatil olmayan): ${AKTIF_HAFTALAR.length}, tatil hafta: ${TATIL_HAFTALARI.length}`);

let atlanmisKazanim = 0;
let atlanmisTatil = 0;

type AtanmisSatir = RehberlikPlanHaftasi & { _haftaNo: number };

const yeniPlan: Record<number, RehberlikPlanHaftasi[]> = {};

for (const key of Object.keys(REHBERLIK_YILLIK_PLAN)) {
  const sinif = Number(key);
  const mevcut = REHBERLIK_YILLIK_PLAN[sinif];

  const kazanimSirasi = mevcut.filter(h => h.etkinlikNo != null);
  const tatilSirasi = mevcut.filter(h => h.etkinlikNo == null && h.tatil);

  const atanmis: AtanmisSatir[] = [];

  kazanimSirasi.forEach((h, i) => {
    const hafta = AKTIF_HAFTALAR[i];
    if (!hafta) { atlanmisKazanim++; return; }
    atanmis.push({ ...h, ay: haftanınAyAdi(hafta), tarih: haftaTarihMetni(hafta), _haftaNo: hafta.haftaNo });
  });

  tatilSirasi.forEach((h, i) => {
    const hafta = TATIL_HAFTALARI[i];
    if (!hafta) { atlanmisTatil++; return; }
    atanmis.push({ ...h, ay: haftanınAyAdi(hafta), tarih: haftaTarihMetni(hafta), _haftaNo: hafta.haftaNo });
  });

  atanmis.sort((a, b) => a._haftaNo - b._haftaNo);

  // "N.HAFTA" etiketini gerçek aya göre yeniden hesapla (o aydaki sıradaki satır).
  const ayIcindekiSayac: Record<string, number> = {};
  const finalHaftalar: RehberlikPlanHaftasi[] = atanmis.map(({ _haftaNo, ...h }) => {
    ayIcindekiSayac[h.ay] = (ayIcindekiSayac[h.ay] ?? 0) + 1;
    return { ...h, hafta: `${ayIcindekiSayac[h.ay]}.HAFTA` };
  });

  yeniPlan[sinif] = finalHaftalar;
}

console.log(`Yerleştirilemeyen kazanım (takvim yetersiz): ${atlanmisKazanim}, yerleştirilemeyen tatil markeri: ${atlanmisTatil}`);
if (atlanmisKazanim > 0 || atlanmisTatil > 0) {
  console.warn('UYARI: Takvimin aktif/tatil hafta sayısı kazanım/tatil sayısıyla tam örtüşmüyor — eksik kalan satırlar eski ay/hafta/tarih değerini korudu, gözden geçir.');
}

function strLit(s: string): string {
  return JSON.stringify(s);
}

function satirYaz(h: RehberlikPlanHaftasi): string {
  let s = `    { ay: ${strLit(h.ay)}, hafta: ${strLit(h.hafta)}, tarih: ${strLit(h.tarih)}, metin: ${strLit(h.metin)}, etkinlikNo: ${h.etkinlikNo === null ? 'null' : h.etkinlikNo}, tatil: ${h.tatil}`;
  if (h.yeterlikAlani !== undefined) s += `, yeterlikAlani: ${strLit(h.yeterlikAlani)}`;
  if (h.etkinlikAdi !== undefined) s += `, etkinlikAdi: ${strLit(h.etkinlikAdi)}`;
  s += ' },';
  return s;
}

const KADEME_YORUM: Record<number, string> = {
  0: 'okul öncesi — okul_oncesi_rehberlik.xlsx',
  1: '1. sınıf — ilkokul1.xlsx', 2: '2. sınıf — ilkokul2.xlsx',
  3: '3. sınıf — ilkokul3.xlsx', 4: '4. sınıf — ilkokul4.xlsx',
  5: '5. sınıf — ortaokul5.xlsx', 6: '6. sınıf — ortaokul6.xlsx',
  7: '7. sınıf — ortaokul7.xlsx', 8: '8. sınıf — ortaokul8.xlsx',
  9: '9. sınıf — lise9.xlsx', 10: '10. sınıf — lise10.xlsx',
  11: '11. sınıf — lise11.xlsx', 12: '12. sınıf — lise12.xlsx',
};

const header = fs.readFileSync('src/data/rehberlikYillikPlanlari.ts', 'utf8').split('export const REHBERLIK_YILLIK_PLAN')[0];

let out = header + 'export const REHBERLIK_YILLIK_PLAN: Record<number, RehberlikPlanHaftasi[]> = {\n';
for (const key of Object.keys(yeniPlan).map(Number).sort((a, b) => a - b)) {
  out += `  ${key}: [ // ${KADEME_YORUM[key] ?? key}\n`;
  for (const h of yeniPlan[key]) out += satirYaz(h) + '\n';
  out += '  ],\n';
}
out += '};\n';

fs.writeFileSync('src/data/rehberlikYillikPlanlari.ts', out, 'utf8');
console.log('Dosya yeniden yazildi.');
