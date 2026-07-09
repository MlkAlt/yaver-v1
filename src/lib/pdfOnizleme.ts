import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system';
import { NavigationProp } from '@react-navigation/native';
// `import type`: RootNavigator ekranlar üzerinden (SablonDoldurmaScreen vb.)
// bu dosyayı dolaylı içe aktarıyor — normal bir value import burada gerçek
// bir circular require'a yol açardı, type-only import derleme zamanında
// tamamen elenir.
import type { RootStackParamList } from '../navigation/RootNavigator';

// expo-print'in printToFileAsync'i `orientation` almıyor — sayfa boyutu yalnızca
// width/height (px, 72 PPI) ile belirleniyor, HTML'deki @page CSS'i native tarafta
// yön için kullanılmıyor (varsayılan 612x792 = US Letter dikey). Bu yüzden yatay
// belgeler için A4 ölçüleri kasıtlı olarak yer değiştirilmiş geçiliyor.
const A4_DIKEY = { width: 595, height: 842 };
const A4_YATAY = { width: 842, height: 595 };

// Uygulama-içi özel önizleme ekranına (PdfOnizlemeScreen — WebView + PDF.js,
// zoom + kaydet/paylaş butonlu) yönlendiriyor. Önceki iki ara-çözüm (native
// print dialog: zoom zayıf/paylaş yok; doğrudan OS paylaşım sheet'i: önizleme
// hiç yok) kullanıcı testinde yetersiz kaldı — bkz. proje hafızası.
export async function pdfOnizlemeAc(
  html: string,
  yatay: boolean,
  navigation: NavigationProp<RootStackParamList>,
) {
  const { width, height } = yatay ? A4_YATAY : A4_DIKEY;
  const { uri } = await Print.printToFileAsync({ html, base64: false, width, height });
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: 'base64' });
  navigation.navigate('PdfOnizleme', { uri, base64 });
}
