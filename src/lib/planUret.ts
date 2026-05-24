import { supabase } from './supabase';

export interface Kazanim {
  kod: string;
  ad: string;
  unite_no: number;
  unite_ad: string;
  sinif: number;
  ders: string | null;
}

export interface PlanHaftasi {
  hafta_no: number;
  baslangic: string;
  bitis: string;
  tatil_mi: boolean;
  tatil_adi: string | null;
  kazanimlar: Kazanim[];
}

export interface YillikPlan {
  brans: string;
  brans_id: string;
  siniflar: number[];
  yil: string;
  toplam_kazanim: number;
  haftalar: PlanHaftasi[];
}


export async function planUret(
  bransAd: string,
  bransId: string,
  siniflar: number[],
  okulTipi?: string,
  seciliDersler?: string[],
  dersFiltesi?: string[],
): Promise<YillikPlan> {
  // Kazanımları çek (sınıf + ünite sıralı)
  // seciliDersler varsa (Sınıf Öğretmenliği gibi multi-ders branşlar):
  //   brans_id yerine ders adına göre, tüm branşlar arasında sorgula
  let q = supabase
    .from('kazanimlar')
    .select('kod, ad, unite_no, unite_ad, sinif, ders')
    .in('sinif', siniflar)
    .order('sinif')
    .order('unite_no')
    .order('kod');

  if (seciliDersler && seciliDersler.length > 0) {
    // Sınıf Öğretmenliği: cross-branş, ders adına göre filtrele
    q = q.in('ders', seciliDersler);
  } else {
    q = q.eq('brans_id', bransId);
    if (dersFiltesi && dersFiltesi.length > 0) {
      // SecmeliDersler ekranı gösterildiyse: zorunlu + seçmeli dersler
      q = q.in('ders', dersFiltesi);
    }
  }
  if (okulTipi) q = q.eq('okul_tipi', okulTipi);

  const { data: kazanimlar, error: kazErr } = await q;

  if (kazErr) throw new Error(`Kazanımlar alınamadı: ${kazErr.message}`);
  let tumKazanimlar = (kazanimlar ?? []) as Kazanim[];

  // Çok-ders modunda (Sınıf Öğretmenliği) İngilizce sinif başına 20 kazanımla sınırla.
  // İngilizce JSON'u diğer branşlardan 5-10x fazla kazanım üretiyor; plan dengesini bozuyor.
  if (seciliDersler && seciliDersler.length > 1) {
    const ING_CAP = 20;
    const ingBySinif = new Map<number, number>();
    tumKazanimlar = tumKazanimlar.filter(k => {
      if (k.ders !== 'İngilizce') return true;
      const count = ingBySinif.get(k.sinif) ?? 0;
      if (count >= ING_CAP) return false;
      ingBySinif.set(k.sinif, count + 1);
      return true;
    });
  }


  // 3. Eğitim takvimini çek (yil INTEGER: 2025 = 2025-2026 eğitim yılı)
  const { data: takvim, error: takvimErr } = await supabase
    .from('egitim_takvimi')
    .select('hafta_no, baslangic, bitis, tatil_mi, tatil_adi')
    .eq('yil', 2025)
    .order('hafta_no');

  if (takvimErr) throw new Error(`Takvim alınamadı: ${takvimErr.message}`);
  const tumHaftalar = takvim ?? [];

  // 4. Orantılı dağıtım: (sinif, ders) çifti bazında grupla
  // Her grup bağımsız dağıtılır → her haftada tüm derslerden kazanım çıkar.
  // Eski yaklaşım (sadece sinif bazında) tüm dersleri tek kovaya koyuyordu;
  // alfabetik kod sırası nedeniyle ilk haftalar tek derse ait kazanımlarla doluyordu.
  const aktifHafta = tumHaftalar.filter((h) => !h.tatil_mi).length || 1;

  const byGroup = new Map<string, Kazanim[]>();
  for (const k of tumKazanimlar) {
    const key = `${k.sinif}:${k.ders ?? ''}`;
    if (!byGroup.has(key)) byGroup.set(key, []);
    byGroup.get(key)!.push(k);
  }

  let aktifIdx = 0;

  const haftalar: PlanHaftasi[] = tumHaftalar.map((hafta) => {
    if (hafta.tatil_mi) {
      return {
        hafta_no: hafta.hafta_no,
        baslangic: hafta.baslangic,
        bitis: hafta.bitis,
        tatil_mi: true,
        tatil_adi: hafta.tatil_adi ?? null,
        kazanimlar: [],
      };
    }

    const i = aktifIdx++;
    const haftalikKazanimlar: Kazanim[] = [];

    for (const items of byGroup.values()) {
      const N = items.length;
      const start = Math.floor(i * N / aktifHafta);
      const end   = Math.min(Math.floor((i + 1) * N / aktifHafta), N);
      if (end > start) {
        haftalikKazanimlar.push(...items.slice(start, end));
      } else {
        haftalikKazanimlar.push(items[Math.min(start, N - 1)]);
      }
    }

    return {
      hafta_no: hafta.hafta_no,
      baslangic: hafta.baslangic,
      bitis: hafta.bitis,
      tatil_mi: false,
      tatil_adi: null,
      kazanimlar: haftalikKazanimlar,
    };
  });

  return {
    brans: bransAd,
    brans_id: bransId,
    siniflar,
    yil: '2025-2026',
    toplam_kazanim: tumKazanimlar.length,
    haftalar,
  };
}
