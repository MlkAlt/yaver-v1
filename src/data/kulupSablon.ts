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

// ─── Yoklama ve Karar Defteri ───────────────────────────────────────────────
export interface OgrenciSatiri {
  no: number;
  adSoyad: string;
  okulNo: string;
  sinifSube: string;
  gorev: string;
}

export function bosOgrenciSatiri(no: number): OgrenciSatiri {
  return { no, adSoyad: '', okulNo: '', sinifSube: '', gorev: '' };
}

export interface KararSatiri {
  no: number;
  kararNo: string;
  kararTarihi: string;
  gundemMaddeleri: string;  // Newline (\n) ile ayrılmış madde listesi
  kararMetni: string;       // Newline (\n) ile ayrılmış madde listesi
  calismaTarihi: string;
  calismaSaati: string;
  kulupMevcudu: string;
  islenenKonu: string;
  katilmayanlar: string;    // Newline ile ayrılmış "Okul No - Sınıf Şube" listesi
}

// İlk toplantı gündem/karar deseni — gerçek bir MEB kulüp karar defterinden
// (Bilim Fen ve Teknoloji Kulübü örneği, RG 30090 Sosyal Etkinlikler Yönetmeliği
// doğrultusunda) alınmıştır. Yalnızca ilk toplantı için uygulanabilir; sonraki
// toplantıların gündem/kararı gerçekten toplantıya özel olduğundan boş bırakılır.
export function ilkToplantiVarsayilanGundem(): string {
  return [
    'Yoklama',
    'Kulüp temsilcisi, temsilci yardımcısı ve sekreterin belirlenmesi',
    'Yıllık çalışma programının hazırlanması',
    'Kulüp temsilcisinin görevleri ile kulübün çalışma usullerinin açıklanması',
    'Dilek ve temenniler',
  ].join('\n');
}

export function ilkToplantiVarsayilanKarar(): string {
  return [
    'Kulüp rehber öğretmeni tarafından öğrencilerin isimleri okunarak yoklama alındı, salt çoğunluğun bulunduğu görüldü.',
    'Kulüp temsilcisi, temsilci yardımcısı ve sekreteri gizli oy açık tasnif usulüyle seçildi.',
    'Kulübün yıllık çalışma planının, Millî Eğitim Bakanlığı Sosyal Etkinlikler Yönetmeliği doğrultusunda danışman öğretmen rehberliğinde hazırlanmasına karar verildi.',
    'Kulüp temsilcisinin görevleri ve kulübün çalışma usulleri danışman öğretmen tarafından açıklandı.',
    'Bu yılın verimli ve güzel geçmesi dilek ve temennileriyle kulüp toplantısı bitirilmiştir.',
  ].join('\n');
}

export function bosKararSatiri(no: number): KararSatiri {
  const ilkToplanti = no === 1;
  return {
    no, kararNo: String(no), kararTarihi: '',
    gundemMaddeleri: ilkToplanti ? ilkToplantiVarsayilanGundem() : '',
    kararMetni: ilkToplanti ? ilkToplantiVarsayilanKarar() : '',
    calismaTarihi: '', calismaSaati: '', kulupMevcudu: '', islenenKonu: '',
    katilmayanlar: '',
  };
}
