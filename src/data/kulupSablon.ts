// Kulüp Yıllık Çalışma Planı — MEB Eğitim Kurumları Sosyal Etkinlikler Yönetmeliği EK-7/b
// Kaynak: RG 8/6/2017-30090 (değ. RG 1/9/2018-30522, RG 12/9/2019-30886)
// Format: Aylık (Ekim → Haziran, 9 satır) — gerçek okul planlarıyla hizalı.
// belirliGunler: O aya denk gelen EK-8 tarihlerinin listesi (opsiyonel).

export interface KulupEtkinlikSatiri {
  no: number;
  tarih: string;
  amac: string;       // Newline (\n) ile ayrılmış madde listesi
  etkinlikler: string; // Newline (\n) ile ayrılmış madde listesi
  belirliGunler?: string; // Newline ile ayrılmış EK-8 günleri (opsiyonel)
}

export function bosEtkinlikSatiri(no: number): KulupEtkinlikSatiri {
  return { no, tarih: '', amac: '', etkinlikler: '', belirliGunler: '' };
}

// ─── Toplum Hizmeti Çalışma Planı ──────────────────────────────────────────
export interface ToplumHizmetSatiri {
  no: number;
  ay: string;
  hafta: string;
  sure: string;
  konular: string;        // Newline (\n) ile ayrılmış madde listesi
  katilanlar: string;
  degerlendirme: string;
}

export function bosToplumHizmetSatiri(no: number): ToplumHizmetSatiri {
  return { no, ay: '', hafta: '', sure: '', konular: '', katilanlar: '', degerlendirme: '' };
}
