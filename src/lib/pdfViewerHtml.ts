// PDF.js'i jsDelivr CDN'den (WebView üzerinden) yükleyip base64 bir PDF'i
// sayfa sayfa <canvas>'a çizen minimal bir görüntüleyici üretir. Ayrı bir
// native kütüphane (react-native-pdf) gerektirmiyor, Expo Go'da çalışır.
// WebView'in kendi pinch-zoom'u (varsayılan açık) sayfaları büyütüp
// küçültmeye yarıyor — ayrı bir zoom JS'i yazmaya gerek yok.
//
// Neden CDN (bundle değil): pdfjs-dist@4+ yalnızca ESM (.mjs) build veriyor,
// eski (UMD) 3.11.174 sürümü hâlâ hem pdf.min.js hem worker'ı klasik
// <script> ile yüklenebilir formatta sunuyor — asset paketleme/expo-asset
// kopyalama karmaşasından kaçınmak için sabit bir sürüme pinlendi.
const PDFJS_VERSION = '3.11.174';
const PDFJS_BASE = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/legacy/build`;

export function pdfViewerHtmlOlustur(base64Pdf: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=yes" />
  <style>
    html, body { margin: 0; padding: 0; background: #E8E6E1; }
    #durum { padding: 40px 16px; text-align: center; font-family: sans-serif; color: #6B6B6B; font-size: 14px; }
    .sayfa { display: block; margin: 12px auto; box-shadow: 0 1px 4px rgba(0,0,0,0.18); background: #fff; }
  </style>
</head>
<body>
  <div id="durum">Yükleniyor…</div>
  <div id="sayfalar"></div>
  <script src="${PDFJS_BASE}/pdf.min.js"></script>
  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc = "${PDFJS_BASE}/pdf.worker.min.js";

    function base64ToUint8Array(base64) {
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return bytes;
    }

    async function render() {
      try {
        const data = base64ToUint8Array("${base64Pdf}");
        const pdf = await pdfjsLib.getDocument({ data }).promise;
        const durum = document.getElementById('durum');
        const kapsayici = document.getElementById('sayfalar');
        durum.style.display = 'none';
        const olcek = 2 * (window.devicePixelRatio || 1);
        for (let sayfaNo = 1; sayfaNo <= pdf.numPages; sayfaNo++) {
          const sayfa = await pdf.getPage(sayfaNo);
          const viewport = sayfa.getViewport({ scale: olcek });
          const canvas = document.createElement('canvas');
          canvas.className = 'sayfa';
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          canvas.style.width = (viewport.width / (window.devicePixelRatio || 1) / 2) + 'px';
          canvas.style.height = (viewport.height / (window.devicePixelRatio || 1) / 2) + 'px';
          kapsayici.appendChild(canvas);
          const ctx = canvas.getContext('2d');
          await sayfa.render({ canvasContext: ctx, viewport }).promise;
        }
      } catch (e) {
        document.getElementById('durum').textContent = 'PDF görüntülenemedi: ' + (e && e.message ? e.message : e);
      }
    }
    render();
  </script>
</body>
</html>`;
}
