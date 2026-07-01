// Sınav analizi arşivi — YEREL (AsyncStorage).
// Login/auth gerekmez, offline çalışır, uygulama indirme boyutunu artırmaz
// (async-storage zaten bağımlılık). Kayıt şekli, auth gelince Supabase
// `sinav_analizleri` tablosuna birebir senkron edilebilecek biçimde tutulur.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { SinavFormData } from './sinavAnaliziSablon';

const ARSIV_KEY = '@yaver/sinav_arsiv';

export interface SinavArsivKaydi {
  id: string;            // benzersiz (zaman tabanlı)
  kayitTarihi: number;   // Date.now() — sıralama için
  // ── liste özeti (hızlı render) ──
  sinif: string;
  dersAdi: string;
  sinavNo: string;
  donem: 1 | 2;
  tarih: string;         // sınav tarihi (gösterim)
  genelBasariYuzdesi: number;
  // ── tam veri (yeniden açma / yeniden PDF) ──
  form: SinavFormData;
}

export function yeniArsivId(): string {
  return `sa_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

export async function arsiviYukle(): Promise<SinavArsivKaydi[]> {
  try {
    const json = await AsyncStorage.getItem(ARSIV_KEY);
    if (!json) return [];
    const liste = JSON.parse(json) as SinavArsivKaydi[];
    return liste.sort((a, b) => b.kayitTarihi - a.kayitTarihi);
  } catch {
    return [];
  }
}

// Aynı id varsa günceller (upsert), yoksa başa ekler.
export async function arsiveKaydet(kayit: SinavArsivKaydi): Promise<void> {
  const liste = await arsiviYukle();
  const digerleri = liste.filter(k => k.id !== kayit.id);
  const yeni = [kayit, ...digerleri].sort((a, b) => b.kayitTarihi - a.kayitTarihi);
  await AsyncStorage.setItem(ARSIV_KEY, JSON.stringify(yeni));
}

export async function arsivdenSil(id: string): Promise<void> {
  const liste = await arsiviYukle();
  await AsyncStorage.setItem(ARSIV_KEY, JSON.stringify(liste.filter(k => k.id !== id)));
}
