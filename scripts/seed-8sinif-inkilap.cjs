// Yaver V1 — F4: 8. sınıf T.C. İnkılap Tarihi kazanımlarını seed et
// Kaynak: MEB güncel müfredat (sosyalbilgiler.org web fetch)
// Branş: Sosyal Bilgiler, ders='T.C. İnkılap Tarihi', okul_tipi='ortaokul', sinif=8

'use strict';
const fs   = require('fs');
const path = require('path');

function loadEnv() {
  const env = {};
  for (const line of fs.readFileSync(path.join(__dirname, '..', '.env.local'), 'utf8').split('\n')) {
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    env[line.slice(0, eq).trim()] = line.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(env.VITE_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

const UNITELER = [
  { no: 1, ad: 'Bir Kahraman Doğuyor', kazanimlar: [
    ['İTA.8.1.1', "Avrupa'daki gelişmelerin yansımaları bağlamında Osmanlı Devleti'nin yirminci yüzyılın başlarındaki siyasi ve sosyal durumunu kavrar."],
    ['İTA.8.1.2', "Mustafa Kemal'in çocukluk döneminde içinde yaşadığı toplumun sosyal ve kültürel yapısını analiz eder."],
    ['İTA.8.1.3', "Mustafa Kemal'in öğrenim hayatından hareketle onun kişilik özelliklerinin oluşumu hakkında çıkarımlarda bulunur."],
    ['İTA.8.1.4', "Gençlik döneminde Mustafa Kemal'in fikir hayatını etkileyen önemli kişileri ve olayları kavrar."],
    ['İTA.8.1.5', "Mustafa Kemal'in askerlik hayatı ile ilgili olayları ve olguları onun kişilik özellikleri ile ilişkilendirir."],
  ]},
  { no: 2, ad: 'Millî Uyanış: Bağımsızlık Yolunda Atılan Adımlar', kazanimlar: [
    ['İTA.8.2.1', "Birinci Dünya Savaşı'nın sebeplerini ve savaşın başlamasına yol açan gelişmeleri kavrar."],
    ['İTA.8.2.2', "Birinci Dünya Savaşı'nda Osmanlı Devleti'nin durumu hakkında çıkarımlarda bulunur."],
    ['İTA.8.2.3', "Mondros Ateşkes Antlaşması'nın imzalanması ve uygulanması karşısında Osmanlı yönetiminin, Mustafa Kemal'in ve halkın tutumunu analiz eder."],
    ['İTA.8.2.4', "Kuvâ-yı Millîye'nin oluşum sürecini ve sonrasında meydana gelen gelişmeleri kavrar."],
    ['İTA.8.2.5', "Millî Mücadele'nin hazırlık döneminde Mustafa Kemal'in yaptığı çalışmaları analiz eder."],
    ['İTA.8.2.6', "Misakımilli'nin kabulünü ve Büyük Millet Meclisinin açılışını vatanın bütünlüğü esası ile 'ulusal egemenlik' ve 'tam bağımsızlık' ilkeleri ile ilişkilendirir."],
    ['İTA.8.2.7', "Büyük Millet Meclisine karşı ayaklanmalar ile ayaklanmaların bastırılması için alınan tedbirleri analiz eder."],
    ['İTA.8.2.8', "Mustafa Kemal'in ve Türk milletinin Sevr Antlaşması'na karşı tepkilerini değerlendirir."],
  ]},
  { no: 3, ad: 'Millî Bir Destan: Ya İstiklâl Ya Ölüm!', kazanimlar: [
    ['İTA.8.3.1', "Millî Mücadele Dönemi'nde Doğu Cephesi ve Güney Cephesi'nde meydana gelen gelişmeleri kavrar."],
    ['İTA.8.3.2', "Millî Mücadele Dönemi'nde Batı Cephesi'nde meydana gelen gelişmeleri kavrar."],
    ['İTA.8.3.3', "Millî Mücadele'nin zor bir döneminde Maarif Kongresi yapan Atatürk'ün, millî ve çağdaş eğitime verdiği önemi kavrar."],
    ['İTA.8.3.4', "Türk milletinin millî birlik, beraberlik ve dayanışmasının bir örneği olarak Tekalif-i Millîye Emirleri doğrultusunda yapılan uygulamaları analiz eder."],
    ['İTA.8.3.5', "Sakarya Meydan Savaşı'nın kazanılmasında ve Büyük Taarruz'un başarılı olmasında Mustafa Kemal'in rolüne ilişkin çıkarımlarda bulunur."],
    ['İTA.8.3.6', "Lozan Antlaşması'nın sağladığı kazanımları analiz eder."],
    ['İTA.8.3.7', "Millî Mücadele Dönemi'nin siyasi, sosyal ve kültürel olaylarının sanat ve edebiyat ürünlerine yansımalarına kanıtlar gösterir."],
  ]},
  { no: 4, ad: 'Atatürkçülük ve Çağdaşlaşan Türkiye', kazanimlar: [
    ['İTA.8.4.1', "Çağdaşlaşan Türkiye'nin temeli olan Atatürk ilkelerini açıklar."],
    ['İTA.8.4.2', "Siyasi alanda meydana gelen gelişmeleri kavrar."],
    ['İTA.8.4.3', "Hukuk alanında meydana gelen gelişmelerin toplumsal hayata yansımalarını kavrar."],
    ['İTA.8.4.4', "Eğitim ve kültür alanında yapılan inkılapları ve gelişmeleri kavrar."],
    ['İTA.8.4.5', "Toplumsal alanda yapılan inkılapları ve meydana gelen gelişmeleri kavrar."],
    ['İTA.8.4.6', "Ekonomi alanında meydana gelen gelişmeleri kavrar."],
    ['İTA.8.4.7', "Atatürk Dönemi'nde sağlık alanında yapılan çalışmaları devletin temel görevleri ile ilişkilendirir."],
    ['İTA.8.4.8', "Cumhuriyet'in sağladığı kazanımları ve Atatürk'ün Türk milleti için gösterdiği hedefleri analiz eder."],
    ['İTA.8.4.9', "Atatürk ilke ve inkılaplarını oluşturan temel esasları kavrar."],
  ]},
  { no: 5, ad: 'Demokratikleşme Çabaları', kazanimlar: [
    ['İTA.8.5.1', "Atatürk Dönemi'ndeki demokratikleşme yolunda atılan adımları açıklar."],
    ['İTA.8.5.2', "Mustafa Kemal'e suikast girişimini analiz eder."],
    ['İTA.8.5.3', "Cumhuriyetin ilk yıllarında Türkiye Cumhuriyeti'ne yönelik tehditleri analiz eder."],
  ]},
  { no: 6, ad: 'Atatürk Dönemi Türk Dış Politikası', kazanimlar: [
    ['İTA.8.6.1', "Atatürk Dönemi Türk dış politikasının temel ilkelerini ve amaçlarını açıklar."],
    ['İTA.8.6.2', "Lozan Barış Antlaşması'nın, Türk dış politikasının gelişimine yaptığı etkiler hakkında çıkarımlarda bulunur."],
    ['İTA.8.6.3', "Atatürk Dönemi Türk dış politikasında yaşanan gelişmeleri analiz eder."],
    ['İTA.8.6.4', "Atatürk'ün Hatay'ı ülkemize katmak konusunda yaptıklarına ve bu uğurda gösterdiği özveriye kanıtlar gösterir."],
  ]},
  { no: 7, ad: "Atatürk'ün Ölümü ve Sonrası", kazanimlar: [
    ['İTA.8.7.1', "Atatürk'ün ölümüne ilişkin yansıma ve değerlendirmelerden hareketle onun fikir ve eserlerinin evrensel değerine ilişkin çıkarımlarda bulunur."],
    ['İTA.8.7.2', "Atatürk'ün Türk Milleti'ne bıraktığı eserlerinden örnekler verir."],
    ['İTA.8.7.3', "Atatürk'ün İkinci Dünya Savaşı öncesi tespitleri ve girişimleri Türkiye'nin savaşta izlediği denge siyaseti ile ilişkilendirilir."],
    ['İTA.8.7.4', "İkinci Dünya Savaşı'ndaki gelişmelerin ve bu savaşın sonuçlarının Türkiye'ye etkilerini analiz eder."],
    ['İTA.8.7.5', "Türkiye'de çok partili siyasi hayata geçişi hızlandıran gelişmeleri, demokrasinin gerekleri açısından analiz eder."],
  ]},
];

async function run() {
  const { data: brans } = await supabase
    .from('branslar')
    .select('id')
    .eq('slug', 'sosyal_bilgiler')
    .single();
  if (!brans) throw new Error('Sosyal Bilgiler branşı bulunamadı');
  console.log(`🔍 Sosyal Bilgiler branş_id: ${brans.id}`);

  const rows = [];
  for (const u of UNITELER) {
    for (const [kod, ad] of u.kazanimlar) {
      rows.push({
        kod,
        brans_id: brans.id,
        sinif: 8,
        unite_no: u.no,
        unite_ad: u.ad,
        ad,
        aciklama: '',
        ders: 'T.C. İnkılap Tarihi',
        okul_tipi: 'ortaokul',
      });
    }
  }

  console.log(`📤 ${rows.length} kazanım insert ediliyor...`);
  const { error } = await supabase.from('kazanimlar').upsert(rows, { onConflict: 'kod', ignoreDuplicates: true });
  if (error) throw new Error('Insert hatası: ' + error.message);

  // Doğrulama
  const { data: check } = await supabase
    .from('kazanimlar')
    .select('kod', { count: 'exact' })
    .eq('brans_id', brans.id)
    .eq('sinif', 8);
  console.log(`✓ Sosyal Bilgiler sinif=8 toplam: ${check.length} kazanım`);

  const { count } = await supabase.from('kazanimlar').select('*', { count: 'exact', head: true });
  console.log(`\nDB'de toplam kazanım: ${count}`);
}

run().catch(err => { console.error('Hata:', err.message); process.exit(1); });
