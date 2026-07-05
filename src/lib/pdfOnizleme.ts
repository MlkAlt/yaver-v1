import * as Print from 'expo-print';

// expo-print'in printToFileAsync'i `orientation` almıyor — sayfa boyutu yalnızca
// width/height (px, 72 PPI) ile belirleniyor, HTML'deki @page CSS'i native tarafta
// yön için kullanılmıyor (varsayılan 612x792 = US Letter dikey). Bu yüzden yatay
// belgeler için A4 ölçüleri kasıtlı olarak yer değiştirilmiş geçiliyor.
const A4_DIKEY = { width: 595, height: 842 };
const A4_YATAY = { width: 842, height: 595 };

export async function pdfOnizlemeAc(html: string, yatay = false) {
  const { width, height } = yatay ? A4_YATAY : A4_DIKEY;
  const { uri } = await Print.printToFileAsync({ html, base64: false, width, height });
  // printToFileAsync'ten farklı olarak printAsync `orientation` alıyor — bu, native
  // print önizleme dialog'unun kendi (sayfa boyutundan bağımsız) yön seçicisini
  // dosyanın gerçek boyutuyla eşler; yoksa dialog varsayılan olarak dikey açılıyor.
  await Print.printAsync({ uri, orientation: yatay ? Print.Orientation.landscape : Print.Orientation.portrait });
}
