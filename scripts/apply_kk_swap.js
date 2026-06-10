process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
const { createClient } = require('@supabase/supabase-js');
const s = createClient(
  'https://oelllamwceazolwpgavq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbGxsYW13Y2Vhem9sd3BnYXZxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NjMzMDU1MCwiZXhwIjoyMDkxOTA2NTUwfQ.rBRrafW73JIw_YWkIiTKj0kDcCcAA-lBtggx0jIfY_0'
);

async function go() {
  // Swap 1: KK.x sinif 9-12 (ihl → lise)
  const { data: r1, error: e1 } = await s
    .from('kazanimlar')
    .update({ okul_tipi: 'lise' })
    .like('kod', 'KK.%')
    .in('sinif', [9, 10, 11, 12])
    .eq('okul_tipi', 'ihl')
    .select('kod');
  console.log('KK.x ihl->lise:', r1?.length ?? 0, 'rows | error:', e1?.message || 'none');

  // Swap 2: KKLISE.x (lise → ihl)
  const { data: r2, error: e2 } = await s
    .from('kazanimlar')
    .update({ okul_tipi: 'ihl' })
    .like('kod', 'KKLISE.%')
    .eq('okul_tipi', 'lise')
    .select('kod');
  console.log('KKLISE.x lise->ihl:', r2?.length ?? 0, 'rows | error:', e2?.message || 'none');

  // Insert hazirlik KK ihl (sinif=0)
  const bransRes = await s.from('branslar').select('id').eq('slug','ihl_meslek_dersleri').limit(1);
  const bransId = bransRes.data?.[0]?.id;
  console.log('Brans id:', bransId);

  const hazirlik = [
    { kod:'KK.H.1.1', sinif:0, unite_no:1, unite_ad:'OKUMA İLE TANIŞIYORUM', ad:'Kuran-ı Kerim\'i okumayı öğrenme ve güzel okumanın önemini müşahede edebilme' },
    { kod:'KK.H.1.2', sinif:0, unite_no:1, unite_ad:'OKUMA İLE TANIŞIYORUM', ad:'Kur\'an-ı Kerim\'in iç düzeni ile ilgili kavramları ayırt edebilme' },
    { kod:'KK.H.2.1', sinif:0, unite_no:2, unite_ad:'TECVİT', ad:'Harfleri telaffuz edebilme' },
    { kod:'KK.H.2.2', sinif:0, unite_no:2, unite_ad:'TECVİT', ad:'Harfleri okunuşları ile telaffuz edebilme' },
    { kod:'KK.H.2.3', sinif:0, unite_no:2, unite_ad:'TECVİT', ad:'Okunuşu özel olan harf ve işaretleri telaffuz edebilme' },
    { kod:'KK.H.2.4', sinif:0, unite_no:2, unite_ad:'TECVİT', ad:'Med (uzatma) çeşitlerini telaffuz edebilme' },
    { kod:'KK.H.3.1', sinif:0, unite_no:3, unite_ad:'YÜZÜNDEN OKUMA', ad:'Fatiha suresini ve Bakara suresinin 1-169. ayetlerini yüzünden okuyabilme' },
    { kod:'KK.H.4.1', sinif:0, unite_no:4, unite_ad:'EZBERİMDEKİLER', ad:'Namaz dualarının anlamlarını yorumlayabilme' },
    { kod:'KK.H.4.2', sinif:0, unite_no:4, unite_ad:'EZBERİMDEKİLER', ad:'Namaz dualarını ezbere okuyabilme' },
    { kod:'KK.H.4.3', sinif:0, unite_no:4, unite_ad:'EZBERİMDEKİLER', ad:'Fatiha ve Fil ila Nâs surelerini anlamada Kur\'an-ı Kerim meallerine başvurabilme' },
    { kod:'KK.H.4.4', sinif:0, unite_no:4, unite_ad:'EZBERİMDEKİLER', ad:'Fatiha ve Fil ila Nâs surelerini tilavet edebilme' },
  ].map(h => ({ ...h, brans_id: bransId, ders: "Kur'an-ı Kerim", okul_tipi: 'ihl' }));

  const { data: r3, error: e3 } = await s.from('kazanimlar').upsert(hazirlik, { onConflict: 'kod' }).select('kod');
  console.log('Hazirlik insert:', r3?.length ?? 0, 'rows | error:', e3?.message || 'none');

  // Final verify
  const { data: kk9 } = await s.from('kazanimlar').select('kod,okul_tipi').eq('kod','KK.9.1.1');
  const { data: kkl9 } = await s.from('kazanimlar').select('kod,okul_tipi').eq('kod','KKLISE.9.1.1');
  const { data: kkh } = await s.from('kazanimlar').select('kod').like('kod','KK.H.%');
  console.log('KK.9.1.1:', kk9?.[0]?.okul_tipi, '| KKLISE.9.1.1:', kkl9?.[0]?.okul_tipi, '| Hazirlik:', kkh?.length);
}
go();
