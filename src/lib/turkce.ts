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
