// Sınıf Rehberlik Dönem Sonu Faaliyet Raporu — statik veri
// Kaynak: evraklar/rehberlik/5.6. Dönem Sonu Rehberlik Raporu.docx (gerçek okul belgesi, hücre hücre incelendi)

export type KazanimDurumu = 'evet' | 'kismen' | 'hayir';

export const KAZANIM_DURUMLARI: { key: KazanimDurumu; label: string }[] = [
  { key: 'evet',   label: 'Evet' },
  { key: 'kismen', label: 'Kısmen' },
  { key: 'hayir',  label: 'Hayır' },
];

export const DONEM_SECENEKLERI: { key: string; label: string }[] = [
  { key: 'donem1',  label: 'I. Dönem Sonu' },
  { key: 'donem2',  label: 'II. Dönem Sonu' },
  { key: 'yilsonu', label: 'Yıl Sonu' },
];

// SN | YAPILAN ÇALIŞMA | KIZ | ERKEK (toplam otomatik)
export type FaaliyetSatiri = { calisma: string; kiz: string; erkek: string };
export const bosFaaliyetSatiri = (): FaaliyetSatiri => ({ calisma: '', kiz: '', erkek: '' });

// SN | YAPILAN ÇALIŞMA | ANNE | BABA | DİĞER
export type VeliFaaliyetSatiri = { calisma: string; anne: string; baba: string; diger: string };
export const bosVeliFaaliyetSatiri = (): VeliFaaliyetSatiri => ({ calisma: '', anne: '', baba: '', diger: '' });
export const varsayilanVeliFaaliyetleri = (): VeliFaaliyetSatiri[] => [
  { calisma: 'Veli Toplantısı', anne: '', baba: '', diger: '' },
  { calisma: 'Bireysel Görüşme', anne: '', baba: '', diger: '' },
];

// SN | ÖĞRENCİ ADI-SOYADI | NUMARASI | VELİ ADI | YÖNLENDİRME NEDENİ
export type YonlendirmeSatiri = { adSoyad: string; no: string; veli: string; neden: string };
export const bosYonlendirmeSatiri = (): YonlendirmeSatiri => ({ adSoyad: '', no: '', veli: '', neden: '' });
