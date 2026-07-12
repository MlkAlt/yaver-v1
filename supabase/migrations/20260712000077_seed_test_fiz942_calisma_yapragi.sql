-- Migration 077: test verisi — FİZ.9.4.2 çalışma yaprağı (worksheet skill'inden gerçek çıktı).
-- Amaç: CalismaYapragiScreen'i uçtan uca test etmek. Kalıcı bir üretim satırı değil,
-- ileride Faz 1 toplu üretimi başlayınca gerçek havuz verisiyle birlikte kalabilir ya da silinebilir.

INSERT INTO calisma_yapraklari (kazanim_kod, varyasyon_no, baslik, tahmini_sure_dk, toplam_puan, html_icerik)
VALUES (
  'FİZ.9.4.2',
  1,
  'Isı, Öz Isı ve Isı Sığası',
  25,
  100,
  '<!DOCTYPE html><html lang=''tr''><head><meta charset=''utf-8''><title>Isı, Öz Isı ve Isı Sığası</title><style>
:root { --koyu: #1d4ed8; --acik: #e8eefc; }
@page { size: A4; margin: 10mm 11mm; }
* { box-sizing: border-box; }
body { font-family: ''Segoe UI'', ''Calibri'', ''DejaVu Sans'', Arial, sans-serif;
  font-size: 9.5pt; line-height: 1.26; color: #1e2430; max-width: 188mm; margin: auto; }
header { display: flex; justify-content: space-between; align-items: flex-start;
  border-bottom: 2.5px solid var(--koyu); padding-bottom: 4px; margin-bottom: 3px; }
h1 { font-size: 13pt; margin: 0 0 2px; color: var(--koyu); }
.chips { display: flex; flex-wrap: wrap; gap: 3px; }
.chip { display: inline-block; font-size: 7pt; border: 1px solid var(--koyu);
  color: var(--koyu); border-radius: 8px; padding: 0 6px; white-space: nowrap; }
.chip.dolu { background: var(--koyu); color: #fff; font-weight: 600; }
.adsoyad { font-size: 8.5pt; text-align: right; line-height: 1.8; white-space: nowrap; }
.kazanim-satiri { font-size: 8pt; color: #444; margin: 1px 0 4px; }
.ozet { background: var(--acik); border-left: 3px solid var(--koyu);
  padding: 4px 8px; font-size: 8.5pt; margin-bottom: 4px; border-radius: 0 4px 4px 0; }
.bolum { display: flex; align-items: baseline; gap: 8px;
  background: var(--acik); border-left: 4px solid var(--koyu); padding: 2px 7px;
  margin: 6px 0 3px; border-radius: 0 4px 4px 0; font-weight: 700; font-size: 10pt;
  color: var(--koyu); page-break-after: avoid; }
.bolum em { font-weight: 400; font-size: 8pt; color: #3c4454; flex: 1; }
.bolum .bpuan { font-size: 7.5pt; }
.soru { margin: 4px 0; page-break-inside: avoid; }
.sgovde { display: flex; gap: 5px; align-items: baseline; }
.sno { background: var(--koyu); color: #fff; border-radius: 50%; min-width: 14px;
  height: 14px; font-size: 8pt; font-weight: 700; display: inline-flex;
  align-items: center; justify-content: center; flex: none; position: relative; top: 1px; }
.spuan { order: 3; font-size: 7pt; color: #667; flex: none; }
.smetin { flex: 1; }
.bosluk { display: inline-block; min-width: 22mm; border-bottom: 1.2px solid #555;
  height: 10px; position: relative; margin: 0 2px; }
.sec { columns: 2; column-gap: 18px; margin: 2px 0 0 19px; font-size: 9pt; }
.sec.tek { columns: 1; }
.sec > div { break-inside: avoid; padding: 0.5px 0; }
.dy { margin: 2px 0 0 19px; font-size: 9pt; }
.dy .kutu { display: inline-block; border: 1px solid #888; border-radius: 3px;
  width: 12px; text-align: center; font-size: 7pt; margin-right: 3px; color: #888; }
.esle { display: flex; gap: 22px; margin: 2px 0 0 19px; font-size: 9pt; }
.esle > div { flex: 1; }
.esle .parantez { color: #778; }
.sira { margin: 2px 0 0 19px; font-size: 9pt; background: #f4f6f9;
  padding: 2px 7px; border-radius: 4px; display: inline-block; }
.sira-yanit { margin: 2px 0 0 19px; font-size: 9pt; }
.havuz { margin: 2px 0 0 19px; display: flex; gap: 4px; flex-wrap: wrap; }
.havuz span { display: inline-block; background: #f4f6f9; border: 1px dashed #99a;
  border-radius: 8px; padding: 0 7px; font-size: 8pt; }
.yanit { margin: 3px 0 0 19px; }
.yanit span { display: block; border-bottom: 1px dotted #9aa; height: 13px; }
.gorsel { margin: 2px 0 0 19px; font-size: 8pt; color: #556; font-style: italic;
  border: 1px dashed #aab; padding: 2px 7px; border-radius: 4px; }
table { border-collapse: collapse; margin: 3px 0 2px 19px; font-size: 8.5pt;
  width: calc(100% - 19px); }
td, th { border: 1px solid #8892a0; padding: 2px 6px; text-align: left; }
th { background: var(--acik); color: var(--koyu); }
code { background: #f0f2f5; padding: 0 3px; border-radius: 3px; font-size: 8.5pt; }
.kir { page-break-before: always; }
.ak-grid { column-count: 2; column-gap: 20px; margin-top: 5px; }
.ak-soru { font-size: 8.5pt; margin-bottom: 5px; break-inside: avoid; }
.ak-cozum { font-size: 7.5pt; color: #445; margin: 1px 0 0 11px; }
@media print { body { max-width: none; } }
@media screen {
  html { background: #e9e7e1; }
  body { background: #fff; padding: 12mm 11mm; margin: 14px auto;
    box-shadow: 0 2px 10px rgba(0,0,0,.15); }
}
</style></head><body><header><div class=''baslik-sol''><h1>Isı, Öz Isı ve Isı Sığası</h1><div class=''chips''><span class=''chip dolu''>FİZ.9.4.2</span><span class=''chip''>Fizik • 9. Sınıf</span><span class=''chip''>4. Üni̇te: Enerji̇</span><span class=''chip''>25 dk • 100 puan</span></div></div><div class=''adsoyad''>Ad Soyad: ______________________<br>Sınıf / No: __________</div></header><div class=''kazanim-satiri''><b>Kazanım:</b> Isı, öz ısı, ısı sığası ve sıcaklık farkı arasındaki matematiksel modele ilişkin tümevarımsal akıl yürütebilme</div><div class=''bolum''><span>Tanıyalım</span><em>Isı, öz ısı ve ısı sığası kavramlarına ilişkin aşağıdaki soruları yanıtlayınız.</em><span class=''bpuan''>26 P</span></div><div class="soru"><div class="sgovde"><span class="sno">1</span><span class="spuan">12p</span><div class="smetin">Aşağıdaki cümlelerde boş bırakılan yerleri kelime havuzundan uygun kavramlarla doldurunuz.<br><br>1. Bir maddenin 1 kg&#x27;lık kütlesinin sıcaklığını 1°C artırmak için gereken ısı miktarına <span class=''bosluk''></span> denir.<br>2. Bir cismin (kütlesi ne olursa olsun) sıcaklığını 1°C artırmak için gereken ısı miktarına <span class=''bosluk''></span> denir.<br>3. Isı sığası, bir maddenin kütlesi ile <span class=''bosluk''></span> değerinin çarpımına eşittir.<br>4. Öz ısı, maddeler için <span class=''bosluk''></span> bir özelliktir; ısı sığası ise değildir.</div></div><div class=''havuz''><span>öz ısı</span><span>ısı sığası</span><span>sıcaklık farkı</span><span>ayırt edici</span><span>ayırt edici olmayan</span><span>kütle</span></div></div><div class="soru"><div class="sgovde"><span class="sno">2</span><span class="spuan">14p</span><div class="smetin">Aşağıdaki ifadelerden doğru olanlara D, yanlış olanlara Y yazınız.</div></div><div class=''dy''><div><span class=''kutu''>D</span><span class=''kutu''>Y</span>Isı sığası, bir madde için ayırt edici bir büyüklüktür.</div><div><span class=''kutu''>D</span><span class=''kutu''>Y</span>Aynı maddeden yapılmış, kütleleri farklı iki cismin öz ısıları birbirine eşittir.</div><div><span class=''kutu''>D</span><span class=''kutu''>Y</span>Bir maddenin sıcaklığını değiştirmek için verilen ısı miktarı yalnızca sıcaklık farkına bağlıdır, kütleye bağlı değildir.</div><div><span class=''kutu''>D</span><span class=''kutu''>Y</span>Isı sığası (C), öz ısı (c) ve kütle (m) arasında C = m·c ilişkisi vardır.</div><div><span class=''kutu''>D</span><span class=''kutu''>Y</span>Eşit kütlede ve eşit sıcaklık farkında ısıtılan iki farklı madde arasında öz ısısı büyük olan, daha fazla ısı alır.</div></div></div><div class=''bolum''><span>Kavrayalım</span><em>Deney verilerini inceleyerek ısı miktarı, kütle, öz ısı ve sıcaklık farkı arasındaki ilişkiyi genelleyiniz.</em><span class=''bpuan''>34 P</span></div><div class="soru"><div class="sgovde"><span class="sno">3</span><span class="spuan">14p</span><div class="smetin">Aynı maddeden yapılmış farklı kütlelerdeki örnekler farklı sıcaklık farklarında ısıtılmış ve alınan ısı miktarları ölçülmüştür (maddenin öz ısısı c = 500 J/(kg·°C) sabittir). Tabloda boş bırakılan ısı miktarlarını hesaplayınız.</div></div><table><tr><th>Kütle (kg)</th><th>Sıcaklık Farkı ΔT (°C)</th><th>Isı Miktarı Q (J)</th></tr><tr><td>1</td><td>10</td><td>5000</td></tr><tr><td>2</td><td>10</td><td></td></tr><tr><td>1</td><td>20</td><td></td></tr><tr><td>2</td><td>20</td><td></td></tr></table></div><div class="soru"><div class="sgovde"><span class="sno">4</span><span class="spuan">20p</span><div class="smetin">s3&#x27;teki tabloyu inceleyiniz.<br><br>a) Kütle iki katına çıktığında (aynı ΔT&#x27;de) ısı miktarı nasıl değişiyor?<br>b) Sıcaklık farkı iki katına çıktığında (aynı kütlede) ısı miktarı nasıl değişiyor?<br>c) Bu gözlemlerden yola çıkarak ısı miktarı (Q) ile kütle (m), öz ısı (c) ve sıcaklık farkı (ΔT) arasındaki matematiksel modeli yazınız.</div></div><div class=''yanit''><span></span><span></span><span></span><span></span></div></div><div class=''bolum''><span>Uygulayalım</span><em>Aşağıdaki problemleri Q = m·c·ΔT ve C = m·c ilişkilerini kullanarak çözünüz.</em><span class=''bpuan''>40 P</span></div><div class="soru"><div class="sgovde"><span class="sno">5</span><span class="spuan">20p</span><div class="smetin">250 g su ısıtılarak sıcaklığı 20°C&#x27;den 60°C&#x27;ye çıkarılıyor. Suyun öz ısısı c = 4200 J/(kg·°C) olduğuna göre suya verilen ısı miktarı (Q) kaç joule&#x27;dür?</div></div><div class=''yanit''><span></span><span></span><span></span></div></div><div class="soru"><div class="sgovde"><span class="sno">6</span><span class="spuan">20p</span><div class="smetin">Kütlesi 400 g olan bir metal parçanın öz ısısı c = 380 J/(kg·°C)&#x27;dir. Bu metal parçanın ısı sığasını (C) hesaplayınız.</div></div><div class=''yanit''><span></span><span></span><span></span></div></div><div class=''kir''></div><header class=''ak-band''><div class=''baslik-sol''><h1>Cevap Anahtarı</h1><div class=''chips''><span class=''chip dolu''>FİZ.9.4.2</span><span class=''chip''>Isı, Öz Isı ve Isı Sığası</span></div></div><div class=''adsoyad''>Öğretmen içindir —<br>dağıtmadan önce ayırınız.</div></header><div class=''ak-grid''><div class=''ak-soru''><b>1.</b> (1) öz ısı, (2) ısı sığası, (3) öz ısı, (4) ayırt edici<div class=''ak-cozum''>1) <b>Öz ısı</b> – birim kütlenin sıcaklığını 1°C artırmak için gereken ısı. 2) <b>Isı sığası</b> – cismin (miktarı ne olursa olsun) sıcaklığını 1°C artırmak için gereken ısı. 3) Isı sığası <b>C = m·c</b> ilişkisiyle kütle ve öz ısının çarpımına eşittir. 4) Öz ısı maddeler için <b>ayırt edici</b>dir (aynı maddenin farklı miktarlarında değişmez); ısı sığası kütleye bağlı olduğundan ayırt edici değildir.</div></div><div class=''ak-soru''><b>2.</b> 1-Y, 2-D, 3-Y, 4-D, 5-D<div class=''ak-cozum''>1) Yanlış: Isı sığası kütleye bağlıdır, ayırt edici değildir. 2) Doğru: Öz ısı maddenin cinsine bağlıdır, kütleye bağlı değildir. 3) Yanlış: Q=mcΔT&#x27;de kütle de etkilidir. 4) Doğru: C=m·c tanımı budur. 5) Doğru: Q=mcΔT&#x27;de m ve ΔT sabitken c büyüdükçe Q büyür.</div></div><div class=''ak-soru''><b>3.</b> {&quot;r1c2&quot;: &quot;10000&quot;, &quot;r2c2&quot;: &quot;10000&quot;, &quot;r3c2&quot;: &quot;20000&quot;}<div class=''ak-cozum''>c = 500 J/(kg·°C) sabit. Q = m·c·ΔT: 2. satır: 2×500×10 = 10000 J. 3. satır: 1×500×20 = 10000 J. 4. satır: 2×500×20 = 20000 J.</div></div><div class=''ak-soru''><b>4.</b> a) Kütle iki katına çıktığında ısı miktarı da iki katına çıkar; Q, m ile doğru orantılıdır. b) Sıcaklık farkı iki katına çıktığında ısı miktarı da iki katına çıkar; Q, ΔT ile doğru orantılıdır. c) Bu iki orantı ve öz ısının etkisi birlikte <b>Q = m·c·ΔT</b> matematiksel modelini verir.<div class=''ak-cozum''>Tabloda kütle 1→2 kg olduğunda (ΔT=10 sabit) Q 5000→10000 J&#x27;e, yani iki katına çıkıyor. ΔT 10→20°C olduğunda (m=1 sabit) Q 5000→10000 J&#x27;e çıkıyor, o da iki katına çıkıyor. Her iki büyüklükle de doğru orantı, öz ısının sabit çarpan olduğu gerçeğiyle birleşince Q = m·c·ΔT modeline ulaşılır.</div></div><div class=''ak-soru''><b>5.</b> <b>42000 J</b><div class=''ak-cozum''>m = 250 g = 0,25 kg, ΔT = 60 − 20 = 40°C. Q = m·c·ΔT = 0,25 × 4200 × 40 = 42000 J.</div></div><div class=''ak-soru''><b>6.</b> <b>152 J/°C</b><div class=''ak-cozum''>m = 400 g = 0,4 kg. C = m·c = 0,4 × 380 = 152 J/°C.</div></div></div></body></html>'
);
