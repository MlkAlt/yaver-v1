// Zümre Öğretmenler Kurulu Tutanağı — statik veri
// Kaynak: MEB Eğitim Kurulları ve Zümreleri Yönergesi (ogm.meb.gov.tr, 21.01.2025)

export type ZumleToplantTipi = 'sene_basi' | 'donem1_ara' | 'donem2_basi' | 'donem2_ara' | 'sene_sonu';

export const TOPLANTI_TIPLERI: { key: ZumleToplantTipi; label: string; no: number; donem: string }[] = [
  { key: 'sene_basi',   label: 'Sene Başı',    no: 1, donem: 'I. Dönem'  },
  { key: 'donem1_ara',  label: '1. Dönem Ara', no: 2, donem: 'I. Dönem'  },
  { key: 'donem2_basi', label: '2. Dönem Başı',no: 3, donem: 'II. Dönem' },
  { key: 'donem2_ara',  label: '2. Dönem Ara', no: 4, donem: 'II. Dönem' },
  { key: 'sene_sonu',   label: 'Sene Sonu',    no: 5, donem: 'II. Dönem' },
];

export type ZumreGundemMaddesi = {
  no: number;
  baslik: string;
  standartMetin: (zumreBaskani: string, brans: string, tip: ZumleToplantTipi) => string;
  sabit?: boolean;
};

export const ZUMRE_GUNDEM_MADDELERI: ZumreGundemMaddesi[] = [
  {
    no: 1,
    baslik: 'Açılış ve yoklama',
    standartMetin: (zb, brans) =>
      `Toplantı, Zümre Başkanı ${zb} tarafından açıldı. ${brans} zümresine ait öğretmenler ve okul yönetimi toplantıya katıldı.`,
    sabit: true,
  },
  {
    no: 2,
    baslik: 'Önceki toplantı kararlarının gözden geçirilmesi',
    standartMetin: (zb, _, tip) => {
      if (tip === 'sene_basi')
        return `Zümre Başkanı ${zb}, bir önceki öğretim yılı sonu zümre toplantısında alınan kararları okudu. Alınan kararların uygulanma durumu değerlendirildi.`;
      if (tip === 'donem2_basi')
        return `Zümre Başkanı ${zb}, I. Dönem zümre toplantılarında alınan kararları okudu. I. Dönem değerlendirmesi yapıldı ve II. Döneme ilişkin tedbirler görüşüldü.`;
      if (tip === 'sene_sonu')
        return `Zümre Başkanı ${zb}, yıl içinde alınan tüm zümre kararlarını okudu. Kararların uygulanma durumu değerlendirildi.`;
      return `Zümre Başkanı ${zb}, bir önceki zümre toplantısında alınan kararları okudu. Kararların uygulanma durumu değerlendirildi.`;
    },
  },
  {
    no: 3,
    baslik: 'Mevzuat ve yeni düzenlemeler',
    standartMetin: (zb) =>
      `Mevzuattaki yenilik ve değişiklikler, yeni emir, genelge ve tebliğler Zümre Başkanı ${zb} tarafından zümre üyelerine aktarıldı. Ölçme ve değerlendirme uygulamalarındaki değişiklikler değerlendirildi.`,
  },
  {
    no: 4,
    baslik: 'Öğretim programları ve yıllık planlar',
    standartMetin: (_, brans, tip) => {
      if (tip === 'sene_basi' || tip === 'donem1_ara')
        return `${brans} dersi öğretim programı incelendi. Yıllık planlar gözden geçirildi, ünite ve konu dağılımları değerlendirildi. Öğretmenler arasında koordinasyonun sağlanması kararlaştırıldı.`;
      if (tip === 'donem2_basi')
        return `II. Dönem ${brans} dersi konuları ve üniteleri gözden geçirildi. Dönem planlaması yeniden değerlendirilerek gerekli güncellemeler yapıldı.`;
      return `Yıl içinde uygulanan ${brans} dersi öğretim planları değerlendirildi. Planlara uyum durumu incelendi.`;
    },
  },
  {
    no: 5,
    baslik: 'Öğretim yöntem ve teknikleri',
    standartMetin: (_, brans) =>
      `${brans} dersinde kullanılan öğretim yöntem ve teknikleri değerlendirildi. Aktif öğrenme yöntemlerinin uygulanması ve teknolojik araçların etkin kullanımı kararlaştırıldı.`,
  },
  {
    no: 6,
    baslik: 'BEP ve özel gereksinimli öğrenciler',
    standartMetin: () =>
      `Özel gereksinimli öğrencilere yönelik Bireyselleştirilmiş Eğitim Programları (BEP) değerlendirildi. Bu öğrencilerin derse katılımını artırmak için destek stratejileri belirlendi ve rehberlik servisiyle iş birliği yapılması kararlaştırıldı.`,
  },
  {
    no: 7,
    baslik: 'Zümreler arası iş birliği',
    standartMetin: (_, brans) =>
      `${brans} dersiyle ilişkili diğer branşlarla ortak çalışmalar yapılması ve bilgi paylaşımının artırılması gerektiği vurgulandı. Disiplinlerarası proje ve etkinliklerde iş birliği planlandı.`,
  },
  {
    no: 8,
    baslik: 'Bilim ve teknoloji gelişmelerinin takibi',
    standartMetin: (_, brans) =>
      `Alanla ilgili güncel bilimsel ve teknolojik gelişmelerin takip edilerek derse yansıtılması gerektiği ifade edildi. ${brans} alanındaki yeni araştırma ve uygulamaların öğrencilerle paylaşılması kararlaştırıldı.`,
  },
  {
    no: 9,
    baslik: 'Öğretim materyalleri ve araç-gereç ihtiyaçları',
    standartMetin: (_, brans) =>
      `${brans} dersinin işlenişinde kullanılan materyaller ve araç-gereçler değerlendirildi. Eksik materyal ve donanım ihtiyaçları tespit edildi, gerekli talepte bulunulacağı kararlaştırıldı.`,
  },
  {
    no: 10,
    baslik: 'Deney, proje ve gezi planlaması',
    standartMetin: (_, brans) =>
      `${brans} dersi kapsamında yapılacak proje çalışmaları ve okul gezileri planlandı. Öğrencilerin uygulamalı öğrenme deneyimleri kazanmaları için gerekli düzenlemelerin yapılması kararlaştırıldı.`,
  },
  {
    no: 11,
    baslik: 'Ölçme-değerlendirme ve sınav analizi',
    standartMetin: (_, brans, tip) => {
      if (tip === 'sene_basi')
        return `${brans} dersinde uygulanacak ölçme ve değerlendirme araçları belirlendi. Sınav takvimi oluşturuldu, soru türleri ve değerlendirme kriterleri kararlaştırıldı.`;
      if (tip === 'sene_sonu')
        return `${brans} dersi yıl sonu başarı durumu analiz edildi. Öğrenci başarısını olumsuz etkileyen faktörler belirlendi ve bir sonraki öğretim yılı için önlemler kararlaştırıldı.`;
      return `${brans} dersinde yapılan sınavların analizleri değerlendirildi. Öğrenci başarı durumu incelendi, konu ve kazanım eksikliği olan öğrenciler için eylem planları oluşturuldu.`;
    },
  },
  {
    no: 12,
    baslik: 'Ortak sınav planlaması',
    standartMetin: (_, brans) =>
      `${brans} dersi için ortak yazılı sınav tarihleri belirlendi. Sınav konuları, soru türleri ve puanlama kriterleri kararlaştırıldı. Ortak sınavların koordineli biçimde uygulanması için görev dağılımı yapıldı.`,
  },
  {
    no: 13,
    baslik: 'Dilek ve temenniler',
    standartMetin: (zb) =>
      `Gündem maddelerinin tamamının görüşülüp karara bağlanmasının ardından, eğitim-öğretim yılının tüm öğretmenler ve öğrenciler için başarılı ve verimli geçmesi dileğiyle toplantı Zümre Başkanı ${zb} tarafından sona erdirildi.`,
    sabit: true,
  },
];
