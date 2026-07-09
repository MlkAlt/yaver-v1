// JS'in varsayılan toUpperCase() Türkçe "i/ı" harflerini yanlış büyütür (i → I, İ değil).
// Bu, Türkçe karakter içeren her başlık/isim için kullanılmalı.
const TR_BUYUK: Record<string, string> = {
  i: 'İ', ı: 'I', ş: 'Ş', ğ: 'Ğ', ü: 'Ü', ö: 'Ö', ç: 'Ç',
};

export function turkceBuyuk(metin: string): string {
  return metin
    .split('')
    .map(ch => TR_BUYUK[ch] ?? ch.toUpperCase())
    .join('');
}

// Uzun okul adları PDF başlığında satır sonunda kırılınca son kelime tek
// başına bir alt satırda "sarkabiliyor" (örn. "...ANADOLU\nLİSESİ"). Son
// boşluğu bozulmaz boşlukla (&nbsp;) değiştirerek son iki kelimenin her zaman
// aynı satırda kalması sağlanır — okul adı ne olursa olsun otomatik çalışır.
export function sarkanKelimeyiKoru(metin: string): string {
  const sonBosluk = metin.lastIndexOf(' ');
  if (sonBosluk === -1) return metin;
  return metin.slice(0, sonBosluk) + '&nbsp;' + metin.slice(sonBosluk + 1);
}
