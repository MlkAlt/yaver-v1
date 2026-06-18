export interface DersBilgi {
  ad: string;
  siniflar: number[];
  okul_tipleri: string[];
  onceden_secili?: boolean;
}

// Branch-specific grade restrictions (overrides OKUL_TIPI_ARALIK in SinifScreen)
export const SINIF_KISITLAMA: Record<string, Partial<Record<string, number[]>>> = {
  din_kulturu:        { ilkokul: [4] },
  ingilizce:          { ilkokul: [2, 3, 4], lise: [0, 9, 10, 11, 12] }, // 0 = hazırlık
  ihl_meslek_dersleri: { ihl: [0, 9, 10, 11, 12] }, // 0 = IHL hazırlık (KK hazırlık)
  // Almanca ortaokul kısıtlaması kaldırıldı — MEB [5-8] tüm sınıflarda
};

interface BransDersler {
  zorunlu: DersBilgi[];
  secmeli: DersBilgi[];
}

const BRANS_DERSLER: Record<string, BransDersler> = {
  turkce: {
    zorunlu: [{ ad: 'Türkçe', siniflar: [5,6,7,8], okul_tipleri: ['ortaokul'] }],
    secmeli: [],
  },
  turk_dili_edebiyati: {
    zorunlu: [{ ad: 'Türk Dili ve Edebiyatı', siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] }],
    secmeli: [],
  },
  matematik: {
    zorunlu: [{ ad: 'Matematik', siniflar: [5,6,7,8,9,10,11,12], okul_tipleri: ['ortaokul','iho','lise','ihl'] }],
    secmeli: [
      { ad: 'Matematik Uygulamaları', siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] },
      { ad: 'Temel Matematik',        siniflar: [11,12],      okul_tipleri: ['lise','ihl'] },
    ],
  },
  fen_bilimleri: {
    zorunlu: [{ ad: 'Fen Bilimleri', siniflar: [5,6,7,8], okul_tipleri: ['ortaokul','iho'] }],
    secmeli: [],
  },
  sosyal_bilgiler: {
    // migration 000012: sinif=8 T.C. İnkılap Tarihi kazanımları bu branşa taşındı
    zorunlu: [
      { ad: 'Sosyal Bilgiler',     siniflar: [5,6,7], okul_tipleri: ['ortaokul','iho'] },
      { ad: 'T.C. İnkılap Tarihi ve Atatürkçülük', siniflar: [8], okul_tipleri: ['ortaokul','iho'] },
    ],
    secmeli: [],
  },
  tarih: {
    zorunlu: [
      { ad: 'Tarih',                               siniflar: [9,10,11],   okul_tipleri: ['lise','ihl'] },
      { ad: 'T.C. İnkılap Tarihi ve Atatürkçülük', siniflar: [12],        okul_tipleri: ['lise','ihl'] },
    ],
    secmeli: [
      { ad: 'Çağdaş Türk ve Dünya Tarihi',     siniflar: [12],         okul_tipleri: ['lise','ihl'] },
      { ad: 'İslam Bilim Tarihi',               siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] },
      { ad: 'Türk Kültür ve Medeniyet Tarihi',  siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] },
      { ad: 'Sosyal Bilim Çalışmaları',         siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] },
    ],
  },
  cografya: {
    zorunlu: [{ ad: 'Coğrafya', siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] }],
    secmeli: [
      { ad: 'İklim, Çevre ve Yenilikçi Çözümler', siniflar: [10,11],      okul_tipleri: ['lise','ihl'] },
      { ad: 'Sosyal Bilim Çalışmaları',            siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] },
    ],
  },
  felsefe: {
    zorunlu: [{ ad: 'Felsefe', siniflar: [10,11], okul_tipleri: ['lise','ihl'] }],
    secmeli: [
      { ad: 'Psikoloji',                  siniflar: [11,12],      okul_tipleri: ['lise','ihl'] },
      { ad: 'Sosyoloji',                  siniflar: [11,12],      okul_tipleri: ['lise','ihl'] },
      { ad: 'Mantık',                     siniflar: [10],         okul_tipleri: ['lise','ihl'] },
      { ad: 'Demokrasi ve İnsan Hakları', siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] },
      { ad: 'Sosyal Bilim Çalışmaları',   siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] },
    ],
  },
  fizik: {
    zorunlu: [{ ad: 'Fizik', siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] }],
    secmeli: [
      { ad: 'Astronomi ve Uzay Bilimleri', siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] },
    ],
  },
  kimya: {
    zorunlu: [{ ad: 'Kimya', siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] }],
    secmeli: [],
  },
  biyoloji: {
    zorunlu: [{ ad: 'Biyoloji', siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] }],
    secmeli: [
      { ad: 'İklim, Çevre ve Yenilikçi Çözümler', siniflar: [10,11], okul_tipleri: ['lise','ihl'] },
    ],
  },
  ingilizce: {
    zorunlu: [{ ad: 'İngilizce', siniflar: [2,3,4,5,6,7,8,9,10,11,12], okul_tipleri: ['ilkokul','ortaokul','iho','lise','ihl'] }],
    secmeli: [],
  },
  din_kulturu: {
    zorunlu: [
      { ad: 'Din Kültürü ve Ahlak Bilgisi', siniflar: [4],          okul_tipleri: ['ilkokul'] },
      { ad: 'Din Kültürü ve Ahlak Bilgisi', siniflar: [5,6,7,8],    okul_tipleri: ['ortaokul','iho'] },
      { ad: 'Din Kültürü ve Ahlak Bilgisi', siniflar: [9,10,11,12], okul_tipleri: ['lise'] },
      // İHO mesleki zorunlu
      { ad: 'Kur\'an-ı Kerim',         siniflar: [5,6,7,8], okul_tipleri: ['iho'] },
      { ad: 'Peygamberimizin Hayatı',   siniflar: [5,6,7,8], okul_tipleri: ['iho'] },
      { ad: 'Temel Dini Bilgiler',      siniflar: [5,6,7,8], okul_tipleri: ['iho'] },
    ],
    secmeli: [
      // Ortaokul seçmeli din dersleri
      { ad: 'Kur\'an-ı Kerim',        siniflar: [5,6,7,8],    okul_tipleri: ['ortaokul'] },
      { ad: 'Temel Dini Bilgiler',    siniflar: [5,6,7,8],    okul_tipleri: ['ortaokul'] },
      { ad: 'Peygamberimizin Hayatı', siniflar: [5,6,7,8],    okul_tipleri: ['ortaokul'] },
      // Lise seçmeli din dersleri
      { ad: 'Kur\'an-ı Kerim',        siniflar: [9,10,11,12], okul_tipleri: ['lise'] },
      { ad: 'Temel Dini Bilgiler',    siniflar: [9,10,11,12], okul_tipleri: ['lise'] },
      { ad: 'Peygamberimizin Hayatı', siniflar: [9,10,11,12], okul_tipleri: ['lise'] },
      { ad: 'İslam Bilim Tarihi',     siniflar: [9,10,11,12], okul_tipleri: ['lise'] },
    ],
  },
  ihl_meslek_dersleri: {
    zorunlu: [
      { ad: 'Kur\'an-ı Kerim',            siniflar: [9,10,11,12], okul_tipleri: ['ihl'] },
      { ad: 'Peygamberimizin Hayatı',      siniflar: [9],          okul_tipleri: ['ihl'] },
      { ad: 'Temel Dini Bilgiler',         siniflar: [9],          okul_tipleri: ['ihl'] },
      { ad: 'Fıkıh',                       siniflar: [10],         okul_tipleri: ['ihl'] },
      { ad: 'Hadis',                       siniflar: [10],         okul_tipleri: ['ihl'] },
      { ad: 'Siyer',                       siniflar: [10],         okul_tipleri: ['ihl'] },
      { ad: 'Akaid',                       siniflar: [11],         okul_tipleri: ['ihl'] },
      { ad: 'Tefsir',                      siniflar: [11],         okul_tipleri: ['ihl'] },
      { ad: 'Hitabet ve Mesleki Uygulama', siniflar: [11],         okul_tipleri: ['ihl'] },
      { ad: 'Kelam',                       siniflar: [12],         okul_tipleri: ['ihl'] },
      { ad: 'Dinler Tarihi',               siniflar: [12],         okul_tipleri: ['ihl'] },
      { ad: 'Arapça',                       siniflar: [9,10],       okul_tipleri: ['ihl'] },
      { ad: 'Mesleki Arapça',              siniflar: [11,12],      okul_tipleri: ['ihl'] },
      { ad: 'Hüsnühat',                    siniflar: [10,11,12],   okul_tipleri: ['ihl'] },
      { ad: 'Ebru',                        siniflar: [10,11,12],   okul_tipleri: ['ihl'] },
      { ad: 'Tezhip',                      siniflar: [10,11,12],   okul_tipleri: ['ihl'] },
      { ad: 'Dini Musiki',                 siniflar: [10,11,12],   okul_tipleri: ['ihl'] },
    ],
    secmeli: [
      { ad: 'İslam Bilim Tarihi',      siniflar: [9,10,11,12], okul_tipleri: ['ihl'] },
      { ad: 'Din Eğitimi',             siniflar: [11],         okul_tipleri: ['ihl'] },
      { ad: 'İslam Felsefesi',         siniflar: [11],         okul_tipleri: ['ihl'] },
      { ad: 'İslam\'da Çocuk Eğitimi', siniflar: [11],         okul_tipleri: ['ihl'] },
      { ad: 'Kur\'an\'ın Ana Konuları', siniflar: [10,11],      okul_tipleri: ['ihl'] },
      { ad: 'Tasavvuf Kültürü',        siniflar: [11],         okul_tipleri: ['ihl'] },
    ],
  },
  gorsel_sanatlar: {
    zorunlu: [
      { ad: 'Görsel Sanatlar', siniflar: [1,2,3,4,5,6,7,8,9,10,11,12], okul_tipleri: ['ilkokul','ortaokul','lise'] },
    ],
    secmeli: [],
  },
  muzik: {
    zorunlu: [
      { ad: 'Müzik', siniflar: [1,2,3,4,5,6,7,8,9,10,11,12], okul_tipleri: ['ilkokul','ortaokul','lise'] },
    ],
    secmeli: [],
  },
  beden_egitimi: {
    zorunlu: [
      { ad: 'Beden Eğitimi ve Oyun', siniflar: [1,2,3,4],            okul_tipleri: ['ilkokul'] },
      { ad: 'Beden Eğitimi ve Spor', siniflar: [5,6,7,8,9,10,11,12], okul_tipleri: ['ortaokul','iho','lise','ihl'] },
      { ad: 'Sağlık Bilgisi ve Trafik Kültürü', siniflar: [9,11],    okul_tipleri: ['lise','ihl'] },
    ],
    secmeli: [
      { ad: 'Takım Sporları', siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] },
    ],
  },
  bilisim_teknolojileri: {
    zorunlu: [{ ad: 'Bilişim Teknolojileri ve Yazılım', siniflar: [5,6], okul_tipleri: ['ortaokul','iho'] }],
    secmeli: [],
  },
  sinif_ogretmeni: {
    zorunlu: [{ ad: 'Sınıf Öğretmenliği', siniflar: [1,2,3,4], okul_tipleri: ['ilkokul'] }],
    secmeli: [],
  },
  teknoloji_tasarim: {
    zorunlu: [{ ad: 'Teknoloji ve Tasarım', siniflar: [7,8], okul_tipleri: ['ortaokul','iho'] }],
    secmeli: [],
  },
  almanca: {
    zorunlu: [
      { ad: 'Almanca', siniflar: [5,6,7,8],    okul_tipleri: ['ortaokul'] },
      { ad: 'Almanca', siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] },
    ],
    secmeli: [],
  },
  fransizca: {
    zorunlu: [{ ad: 'Fransızca', siniflar: [9,10,11,12], okul_tipleri: ['lise','ihl'] }],
    secmeli: [],
  },
  arapca: {
    zorunlu: [
      { ad: 'Arapça',         siniflar: [5,6,7,8], okul_tipleri: ['iho'] },
      { ad: 'Arapça',         siniflar: [9,10],    okul_tipleri: ['ihl'] },
      { ad: 'Mesleki Arapça', siniflar: [11,12],   okul_tipleri: ['ihl'] },
    ],
    secmeli: [],
  },
};

// Sınıf bazlı helpers — okulTipi gerektirmez

export function getGradeRange(slug: string): number[] {
  const brans = BRANS_DERSLER[slug];
  if (!brans) return [];
  const all = new Set<number>();
  brans.zorunlu.forEach(d => d.siniflar.forEach(s => all.add(s)));
  brans.secmeli.forEach(d => d.siniflar.forEach(s => all.add(s)));
  return [...all].sort((a, b) => a - b);
}

export function getZorunluDersler(slug: string, siniflar: number[], okulTipi?: string): DersBilgi[] {
  const brans = BRANS_DERSLER[slug];
  if (!brans) return [];
  return brans.zorunlu.filter(d =>
    d.siniflar.some(s => siniflar.includes(s)) &&
    (!okulTipi || d.okul_tipleri.includes(okulTipi))
  );
}

export function getSecmeliDersler(slug: string, siniflar: number[], okulTipi?: string): DersBilgi[] {
  const brans = BRANS_DERSLER[slug];
  if (!brans) return [];
  return brans.secmeli.filter(d =>
    d.siniflar.some(s => siniflar.includes(s)) &&
    (!okulTipi || d.okul_tipleri.includes(okulTipi))
  );
}

export function hasEkDers(slug: string, siniflar: number[], okulTipi?: string): boolean {
  const zorunlu = getZorunluDersler(slug, siniflar, okulTipi);
  const secmeli = getSecmeliDersler(slug, siniflar, okulTipi);
  return zorunlu.length > 1 || secmeli.length > 0;
}

export function deriveOkulTipi(siniflar: number[]): string {
  if (siniflar.length === 0) return 'lise';
  const min = Math.min(...siniflar);
  if (min <= 4) return 'ilkokul';
  if (min <= 8) return 'ortaokul';
  return 'lise';
}

// Legacy — mevcut EkDerslerScreen (Sınıf Öğretmenliği) için korunuyor
export function getSecmeli(slug: string, okulTipi: string, siniflar: number[]): DersBilgi[] {
  const brans = BRANS_DERSLER[slug];
  if (!brans) return [];
  return brans.secmeli.filter(d =>
    d.okul_tipleri.includes(okulTipi) &&
    d.siniflar.some(s => siniflar.includes(s))
  );
}

export function getZorunluDersAdlari(slug: string, okulTipi: string, siniflar: number[]): string[] {
  const brans = BRANS_DERSLER[slug];
  if (!brans) return [];
  const adlar = new Set<string>();
  for (const d of brans.zorunlu) {
    if (d.okul_tipleri.includes(okulTipi) && d.siniflar.some(s => siniflar.includes(s))) {
      adlar.add(d.ad);
    }
  }
  return [...adlar];
}

// ── Okul türü tile helpers ────────────────────────────────────────────────────

export type KademeTile = { label: string; okulTipi: string };

const KADEME_GRADES: Record<string, number[]> = {
  ilkokul: [1, 2, 3, 4],
  ortaokul: [5, 6, 7, 8],
  lise: [9, 10, 11, 12],
  iho: [5, 6, 7, 8],
  ihl: [9, 10, 11, 12],
};

export function getKademeTiles(slug: string): KademeTile[] {
  if (slug === 'din_kulturu') return [
    { label: 'İlkokul', okulTipi: 'ilkokul' },
    { label: 'Ortaokul', okulTipi: 'ortaokul' },
    { label: 'Lise', okulTipi: 'lise' },
    { label: 'İmam Hatip Ortaokulu', okulTipi: 'iho' },
  ];
  if (slug === 'arapca') return [
    { label: 'İmam Hatip Ortaokulu', okulTipi: 'iho' },
    { label: 'İmam Hatip Lisesi', okulTipi: 'ihl' },
  ];
  const grades = getGradeRange(slug);
  if (grades.length === 0) return [];
  const tiles: KademeTile[] = [];
  if (grades.some(g => g <= 4)) tiles.push({ label: 'İlkokul', okulTipi: 'ilkokul' });
  if (grades.some(g => g >= 5 && g <= 8)) tiles.push({ label: 'Ortaokul', okulTipi: 'ortaokul' });
  if (grades.some(g => g >= 9)) tiles.push({ label: 'Lise', okulTipi: 'lise' });
  return tiles.length > 1 ? tiles : [];
}

export function getGradeRangeForOkulTipi(slug: string, okulTipi: string): number[] {
  const kisitlama = SINIF_KISITLAMA[slug]?.[okulTipi];
  if (kisitlama) return [...kisitlama].sort((a, b) => a - b);
  const allGrades = getGradeRange(slug);
  const limits = KADEME_GRADES[okulTipi] ?? [];
  return allGrades.filter(s => limits.includes(s)).sort((a, b) => a - b);
}
