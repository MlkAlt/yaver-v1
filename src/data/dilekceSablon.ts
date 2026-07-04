// Öğretmen dilekçe bankası — statik veri.
// Ürün kararı: curated küçük set (4 tür). Öğretmen türü seçer, hazır gövde
// kalıbını düzenler. Kaynak mantığı: evraklar/dilekce/dilekcesi.docx (mazeret
// izni bölümleri) — referans placeholder/mock metinli olduğu için yalnızca
// yapı/mantık alındı, mock cümleler kopyalanmadı. Gövdeler resmi MEB dilekçe
// diline göre sıfırdan yazıldı; köşeli parantezli [...] kısımlar öğretmenin
// düzenleyeceği ipuçlarıdır.

export type DilekceTuru = 'mazeret' | 'ucretsiz' | 'nakil' | 'genel';

// Doldurma sihirbazında gösterilebilecek/kullanılan form alanı anahtarları.
export type DilekceAlan =
  | 'makam'
  | 'adSoyad'
  | 'gorev'
  | 'tc'
  | 'govde'
  | 'ekler'
  | 'imzaYeri'
  | 'tarih';

export type DilekceSablonu = {
  id: DilekceTuru;
  ad: string;              // kart/başlık adı
  aciklama: string;        // kısa alt metin (kart açıklaması)
  makamVarsayilan: string; // hitap edilen makam (düzenlenebilir default)
  govdeKalibi: string;     // düzenlenebilir gövde taslağı ([...] ipuçlu)
  alanlar: DilekceAlan[];  // bu tür için sihirbazda gösterilecek alanlar (sıralı)
};

// Doldurulmuş dilekçe. Başlık (makam) ve imza bloğu yapısal alanlardan; gövde
// ise düzenlenmiş serbest metinden (govdeKalibi türevi) render edilir.
export type DilekceFormData = {
  turu: DilekceTuru;
  adSoyad: string;
  gorev: string;      // branş/görev, ör. "Matematik Öğretmeni"
  tc?: string;        // opsiyonel T.C. kimlik no
  tarih: string;      // imza bloğu tarihi, ör. "04.07.2026"
  makam: string;      // hitap edilen makam (render'da büyük harfe çevrilir)
  govde: string;      // düzenlenmiş gövde metni
  ekler: string[];    // EKLER listesi (boşsa gösterilmez)
  imzaYeri?: string;  // opsiyonel yer adı — tarihin önüne "Konya, 04.07.2026"
};

export const DILEKCE_SABLONLARI: DilekceSablonu[] = [
  {
    id: 'mazeret',
    ad: 'Mazeret İzni Dilekçesi',
    aciklama: 'Ailevi veya sağlık mazereti için gün/saat izni talebi.',
    makamVarsayilan: '[OKUL ADI] MÜDÜRLÜĞÜNE',
    govdeKalibi:
`Okulunuzda [branşınızı yazınız] öğretmeni olarak görev yapmaktayım.

[Başlangıç tarihi] – [Bitiş tarihi] tarihleri arasında, [mazeret sebebini kısaca yazınız] nedeniyle toplam [gün/saat] mazeret izni kullanmak istiyorum.

İznim süresince ders ve nöbet görevlerimin planlanması hususunda gereğini saygılarımla arz ederim.`,
    alanlar: ['makam', 'adSoyad', 'gorev', 'tc', 'govde', 'ekler', 'imzaYeri', 'tarih'],
  },
  {
    id: 'ucretsiz',
    ad: 'Ücretsiz (Aylıksız) İzin Dilekçesi',
    aciklama: '657 sayılı Kanun kapsamında aylıksız izin talebi.',
    makamVarsayilan: '[OKUL ADI] MÜDÜRLÜĞÜNE',
    govdeKalibi:
`Okulunuzda [branşınızı yazınız] öğretmeni olarak görev yapmaktayım.

657 sayılı Devlet Memurları Kanunu'nun ilgili maddesi kapsamında, [başlangıç tarihi] tarihinden itibaren [süreyi yazınız] süreyle aylıksız (ücretsiz) izin kullanmak istiyorum.

Talebimin değerlendirilerek gereğinin yapılmasını saygılarımla arz ederim.`,
    alanlar: ['makam', 'adSoyad', 'gorev', 'tc', 'govde', 'ekler', 'imzaYeri', 'tarih'],
  },
  {
    id: 'nakil',
    ad: 'Nakil / Tayin Talebi Dilekçesi',
    aciklama: 'Özür, eş veya sağlık durumu gerekçesiyle atama (nakil) talebi.',
    makamVarsayilan: '[İL] MİLLİ EĞİTİM MÜDÜRLÜĞÜNE',
    govdeKalibi:
`Hâlen [görev yaptığınız okul ve ilçe] okulunda [branşınızı yazınız] öğretmeni olarak görev yapmaktayım.

[Özür durumu / eş durumu / sağlık / öğrenim vb. gerekçenizi yazınız] gerekçesiyle, [talep ettiğiniz il/ilçe] iline naklimin yapılmasını talep ediyorum.

Durumumu belgeleyen ekteki evrakların değerlendirilerek gereğinin yapılmasını saygılarımla arz ederim.`,
    alanlar: ['makam', 'adSoyad', 'gorev', 'tc', 'govde', 'ekler', 'imzaYeri', 'tarih'],
  },
  {
    id: 'genel',
    ad: 'Genel Dilekçe (Boş)',
    aciklama: 'Serbest konulu dilekçe — gövdeyi kendiniz yazarsınız.',
    makamVarsayilan: '[OKUL ADI] MÜDÜRLÜĞÜNE',
    govdeKalibi:
`Okulunuzda [branşınızı yazınız] öğretmeni olarak görev yapmaktayım.

[Talebinizi veya durumunuzu buraya açık ve kısa bir şekilde yazınız.]

Gereğini bilgilerinize arz ederim.`,
    alanlar: ['makam', 'adSoyad', 'gorev', 'govde', 'ekler', 'imzaYeri', 'tarih'],
  },
];

export function getDilekceSablonu(turu: DilekceTuru): DilekceSablonu {
  return DILEKCE_SABLONLARI.find(s => s.id === turu) ?? DILEKCE_SABLONLARI[0];
}

// Sihirbaz için başlangıç form durumu — makam/gövde kalıptan önden dolar,
// kişisel alanlar boş bırakılır (şef OnboardingContext'ten besleyebilir).
export function bosDilekceFormu(turu: DilekceTuru): DilekceFormData {
  const s = getDilekceSablonu(turu);
  return {
    turu,
    adSoyad: '',
    gorev: '',
    tc: '',
    tarih: '',
    makam: s.makamVarsayilan,
    govde: s.govdeKalibi,
    ekler: [],
    imzaYeri: '',
  };
}
