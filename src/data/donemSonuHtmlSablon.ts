import { KazanimDurumu, FaaliyetSatiri, VeliFaaliyetSatiri, YonlendirmeSatiri } from './donemSonuSablon';
import { turkceBuyuk } from '../lib/turkce';

export type DonemSonuFormData = {
  okulAdi: string;
  egitimYili: string;      // "2024-2025"
  donemLabel: string;      // "II. Dönem Sonu"
  sinif: string;           // "11 / C"
  sinifRehberOgretmeni: string;
  okulMuduru: string;
  tarih: string;
  kazanimDurumu: KazanimDurumu;
  kazanimAciklama: string;         // kısmen/hayır ise gerçekleştirilemeyenler
  uygulananTeknikler: string;
  rehberlikFaaliyetleri: FaaliyetSatiri[];
  veliFaaliyetleri: VeliFaaliyetSatiri[];
  yonlendirmeler: YonlendirmeSatiri[];
  guclukler: string;
  cozumOnerileri: string;
  pdrIsbirligi: string;
  pdrBeklenti: string;
};

function kutu(secili: boolean): string {
  return secili ? '(X)' : '(&nbsp;&nbsp;)';
}

function toplam(kiz: string, erkek: string): string {
  const t = (parseInt(kiz, 10) || 0) + (parseInt(erkek, 10) || 0);
  return t > 0 ? String(t) : '';
}

// Dolu satır yoksa elle doldurmak için n boş numaralı satır bas
function bosSatirlar(kolonSayisi: number, adet: number): string {
  let html = '';
  for (let i = 1; i <= adet; i++) {
    const hucreler = Array.from({ length: kolonSayisi }, () => '<td>&nbsp;</td>').join('');
    html += `<tr><td class="sn">${i}</td>${hucreler}</tr>`;
  }
  return html;
}

function metinKutusu(metin: string): string {
  const temiz = metin.trim();
  return temiz
    ? `<div class="metin">${temiz.replace(/\n/g, '<br/>')}</div>`
    : '<div class="metin bos"></div>';
}

export function donemSonuHtmlOlustur(form: DonemSonuFormData): string {
  const {
    okulAdi, egitimYili, donemLabel, sinif, sinifRehberOgretmeni, okulMuduru, tarih,
    kazanimDurumu, kazanimAciklama, uygulananTeknikler,
    rehberlikFaaliyetleri, veliFaaliyetleri, yonlendirmeler,
    guclukler, cozumOnerileri, pdrIsbirligi, pdrBeklenti,
  } = form;

  const faaliyetDolu = rehberlikFaaliyetleri.filter(f => f.calisma.trim());
  const faaliyetRows = faaliyetDolu.length
    ? faaliyetDolu.map((f, i) => `<tr><td class="sn">${i + 1}</td><td>${f.calisma}</td><td class="say">${f.kiz}</td><td class="say">${f.erkek}</td><td class="say">${toplam(f.kiz, f.erkek)}</td></tr>`).join('')
    : bosSatirlar(4, 5);

  const veliDolu = veliFaaliyetleri.filter(v => v.calisma.trim());
  const veliRows = veliDolu.length
    ? veliDolu.map((v, i) => `<tr><td class="sn">${i + 1}</td><td>${v.calisma}</td><td class="say">${v.anne}</td><td class="say">${v.baba}</td><td class="say">${v.diger}</td></tr>`).join('')
    : bosSatirlar(4, 3);

  const yonDolu = yonlendirmeler.filter(y => y.adSoyad.trim() || y.neden.trim());
  const yonRows = yonDolu.length
    ? yonDolu.map((y, i) => `<tr><td class="sn">${i + 1}</td><td>${y.adSoyad}</td><td class="say">${y.no}</td><td>${y.veli}</td><td>${y.neden}</td></tr>`).join('')
    : bosSatirlar(4, 4);

  return `<!DOCTYPE html>
<html lang="tr">
<head>
<meta charset="UTF-8"/>
<style>
  @page { size: A4; margin: 14mm 16mm; }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Times New Roman', serif; font-size: 10.5pt; color: #000; }
  .baslik { text-align: center; margin-bottom: 12px; }
  .baslik h1 { font-size: 12pt; margin-bottom: 2px; }
  .baslik h2 { font-size: 11pt; }
  .ust-satir { display: flex; justify-content: space-between; margin-bottom: 10px; font-weight: bold; }
  .bolum-baslik { font-weight: bold; font-size: 10.5pt; margin: 12px 0 5px; }
  .durum-satiri { margin: 4px 0 8px; }
  .durum-satiri .secenek { margin-right: 18px; font-weight: bold; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 6px; }
  thead { display: table-header-group; }
  th, td { border: 1px solid #000; padding: 4px 6px; font-size: 9.5pt; vertical-align: top; }
  th { background: #f0f0f0; font-weight: bold; text-align: center; }
  tr { page-break-inside: avoid; break-inside: avoid; }
  td.sn { width: 6%; text-align: center; }
  td.say { width: 12%; text-align: center; }
  .metin { border: 1px solid #000; padding: 6px 8px; line-height: 1.5; min-height: 34px; }
  .metin.bos { min-height: 48px; }
  .not { font-size: 8.5pt; font-style: italic; margin-top: 12px; }
  .imza-alani { margin-top: 26px; display: flex; justify-content: space-between; }
  .imza-kutu { text-align: center; width: 46%; }
  .imza-kutu .cizgi { border-top: 1px solid #000; margin: 34px 0 4px; }
</style>
</head>
<body>

<div class="baslik">
  <h1>${egitimYili} EĞİTİM-ÖĞRETİM YILI</h1>
  <h1>${turkceBuyuk(okulAdi)}</h1>
  <h2>SINIF REHBERLİK HİZMETLERİ ${turkceBuyuk(donemLabel)} FAALİYET RAPORU</h2>
</div>

<div class="ust-satir">
  <span>Sınıf/Şube: ${sinif}</span>
  <span>Sınıf Rehber Öğretmeni: ${sinifRehberOgretmeni}</span>
</div>

<div class="bolum-baslik">1. Sınıf Rehberlik Planında Yer Alan Kazanımlar</div>
<div class="durum-satiri">
  Tüm kazanımlar (yıllık plana göre) gerçekleştirilebildi mi?&nbsp;&nbsp;
  <span class="secenek">Evet ${kutu(kazanimDurumu === 'evet')}</span>
  <span class="secenek">Kısmen ${kutu(kazanimDurumu === 'kismen')}</span>
  <span class="secenek">Hayır ${kutu(kazanimDurumu === 'hayir')}</span>
</div>
${kazanimDurumu !== 'evet' ? `<div>Cevabınız kısmen/hayır ise, gerçekleştirilemeyen kazanımlar:</div>${metinKutusu(kazanimAciklama)}` : ''}

<div class="bolum-baslik">2. Uygulanan Teknikler (otobiyografi, öğrenci tanıma formu vb.)</div>
${metinKutusu(uygulananTeknikler)}

<div class="bolum-baslik">3. Yapılan Rehberlik Faaliyetleri</div>
<table>
  <thead><tr><th class="sn">SN</th><th>YAPILAN ÇALIŞMA</th><th class="say">KIZ</th><th class="say">ERKEK</th><th class="say">TOPLAM</th></tr></thead>
  <tbody>${faaliyetRows}</tbody>
</table>

<div class="bolum-baslik">4. PDR Servisine Yönlendirilen Öğrenci ve Veliler</div>
<table>
  <thead><tr><th class="sn">SN</th><th>ÖĞRENCİ ADI-SOYADI</th><th class="say">NUMARASI</th><th>VELİ ADI</th><th>YÖNLENDİRME NEDENİ</th></tr></thead>
  <tbody>${yonRows}</tbody>
</table>

<div class="bolum-baslik">5. Velilere Yönelik Yapılan Faaliyetler</div>
<table>
  <thead><tr><th class="sn">SN</th><th>YAPILAN ÇALIŞMA</th><th class="say">ANNE</th><th class="say">BABA</th><th class="say">DİĞER</th></tr></thead>
  <tbody>${veliRows}</tbody>
</table>

<div class="bolum-baslik">6. Karşılaşılan Güçlükler ve Çözüm Önerileri</div>
<div>Karşılaşılan güçlükler ve nedenleri:</div>
${metinKutusu(guclukler)}
<div style="margin-top:6px">Çözüm önerileri:</div>
${metinKutusu(cozumOnerileri)}

<div class="bolum-baslik">7. Okul PDR Servisi İle İşbirliği</div>
<div>Okul PDR Servisi ve sınıf rehber öğretmenleri arasındaki işbirliği:</div>
${metinKutusu(pdrIsbirligi)}
<div style="margin-top:6px">Okul PDR Servisinden beklentileriniz:</div>
${metinKutusu(pdrBeklenti)}

<p class="not">*Bu raporun bir örneği sınıf rehberlik dosyasında tutulmak kaydıyla, okul idaresi ya da PDR Servisi tarafından muhafaza edilir.</p>

<div class="imza-alani">
  <div class="imza-kutu">
    <div class="cizgi"></div>
    <p>${sinifRehberOgretmeni}</p>
    <p>Sınıf Rehber Öğretmeni</p>
    <p>${tarih}</p>
  </div>
  <div class="imza-kutu">
    <div class="cizgi"></div>
    <p>${okulMuduru}</p>
    <p>Okul Müdürü</p>
  </div>
</div>

</body>
</html>`;
}
