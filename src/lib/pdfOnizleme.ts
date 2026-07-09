import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

// expo-print'in printToFileAsync'i `orientation` almıyor — sayfa boyutu yalnızca
// width/height (px, 72 PPI) ile belirleniyor, HTML'deki @page CSS'i native tarafta
// yön için kullanılmıyor (varsayılan 612x792 = US Letter dikey). Bu yüzden yatay
// belgeler için A4 ölçüleri kasıtlı olarak yer değiştirilmiş geçiliyor.
const A4_DIKEY = { width: 595, height: 842 };
const A4_YATAY = { width: 842, height: 595 };

// Print.printAsync (native print dialog) yerine expo-sharing kullanılıyor: geçici
// çözüm (evraklar bitene kadar Expo Go'da test edilebilsin diye), kullanıcı OS
// paylaşım sheet'inden istediği bir uygulamada (Drive, Dosyalar vb.) PDF'i açıp
// oranın kendi zoom/paylaşım özelliklerini kullanabiliyor. Uygulama tamamlanmaya
// yakın react-native-pdf + custom dev build ile uygulama-içi özel bir önizleme
// ekranına (zoom + kaydet/paylaş butonlu) geçilecek — bkz. proje hafızası.
export async function pdfOnizlemeAc(html: string, yatay = false) {
  const { width, height } = yatay ? A4_YATAY : A4_DIKEY;
  const { uri } = await Print.printToFileAsync({ html, base64: false, width, height });
  await Sharing.shareAsync(uri, { mimeType: 'application/pdf', UTI: 'com.adobe.pdf' });
}
