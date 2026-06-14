import { supabase } from './supabase';

export interface Kazanim {
  id: number;
  kod: string;
  ad: string;
  unite: string;
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
  brans_slug: string;
  siniflar: number[];
  yil: string;
  toplam_kazanim: number;
  haftalar: PlanHaftasi[];
}

interface UnitSlot {
  items: Kazanim[];
  aktifStart: number;
  aktifEnd: number;
}

export async function planUret(
  bransAd: string,
  bransSlug: string,
  siniflar: number[],
  okulTipi?: string,
  seciliDersler?: string[],
  dersFiltesi?: string[],
): Promise<YillikPlan> {
  let q = supabase
    .from('kazanimlar')
    .select('id, kod, ad, unite, sinif, ders')
    .in('sinif', siniflar)
    .eq('sinif_tipi', 'normal')
    .order('sinif')
    .order('unite')
    .order('kod');

  if (seciliDersler && seciliDersler.length > 0) {
    q = q.in('ders', seciliDersler);
  } else {
    q = q.or(`brans.eq.${bransSlug},branslar.cs.{${bransSlug}}`);
    if (dersFiltesi && dersFiltesi.length > 0) {
      q = q.in('ders', dersFiltesi);
    }
  }
  if (okulTipi) q = q.eq('okul_tipi', okulTipi);

  const { data: kazanimlar, error: kazErr } = await q;
  if (kazErr) throw new Error(`Kazanımlar alınamadı: ${kazErr.message}`);
  let tumKazanimlar = (kazanimlar ?? []) as Kazanim[];

  // Çok-ders modunda İngilizce sınıf başına 20 kazanımla sınırla
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

  const { data: takvim, error: takvimErr } = await supabase
    .from('egitim_takvimi')
    .select('hafta_no, baslangic, bitis, tatil_mi, tatil_adi')
    .eq('yil', 2025)
    .order('hafta_no');

  if (takvimErr) throw new Error(`Takvim alınamadı: ${takvimErr.message}`);
  const tumHaftalar = takvim ?? [];

  const aktifHafta = tumHaftalar.filter((h) => !h.tatil_mi).length || 1;

  // Grup: (sinif, ders) → kazanım listesi (unite_no sıralı)
  const byDersGroup = new Map<string, Kazanim[]>();
  for (const k of tumKazanimlar) {
    const key = `${k.sinif}:${k.ders ?? ''}`;
    if (!byDersGroup.has(key)) byDersGroup.set(key, []);
    byDersGroup.get(key)!.push(k);
  }

  // Her (sinif, ders) grubunu unite_no bazında böl ve ardışık hafta aralıkları ata.
  // Ünite sınırı asla hafta ortasına denk gelmez: her ünite kendi ardışık hafta bloğuna sahiptir.
  const unitSlots: UnitSlot[] = [];
  for (const items of byDersGroup.values()) {
    const totalN = items.length;
    if (totalN === 0) continue;

    // Ünite bloklarına ayır (items zaten unite_no sıralı — sorgu ORDER BY garantisi)
    const units: Kazanim[][] = [];
    let lastUnite = '';
    for (const k of items) {
      if (k.unite !== lastUnite) {
        units.push([]);
        lastUnite = k.unite;
      }
      units[units.length - 1].push(k);
    }

    // Kümülatif kazanım oranına göre ardışık hafta aralıkları ata
    let weekOffset = 0;
    let cumulativeItems = 0;
    for (let u = 0; u < units.length; u++) {
      cumulativeItems += units[u].length;
      const unitEnd = u === units.length - 1
        ? aktifHafta
        : Math.round(cumulativeItems / totalN * aktifHafta);
      const weeksForUnit = Math.max(0, unitEnd - weekOffset);
      if (weeksForUnit > 0) {
        unitSlots.push({ items: units[u], aktifStart: weekOffset, aktifEnd: unitEnd });
      }
      weekOffset = unitEnd;
    }
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

    for (const slot of unitSlots) {
      const rangeSize = slot.aktifEnd - slot.aktifStart;
      if (rangeSize <= 0) continue;
      const relI = i - slot.aktifStart;
      if (relI < 0 || relI >= rangeSize) continue;

      const N = slot.items.length;
      const start = Math.floor(relI * N / rangeSize);
      const end   = Math.min(Math.floor((relI + 1) * N / rangeSize), N);
      if (end > start) {
        haftalikKazanimlar.push(...slot.items.slice(start, end));
      } else {
        haftalikKazanimlar.push(slot.items[Math.min(start, N - 1)]);
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
    brans_slug: bransSlug,
    siniflar,
    yil: '2025-2026',
    toplam_kazanim: tumKazanimlar.length,
    haftalar,
  };
}
