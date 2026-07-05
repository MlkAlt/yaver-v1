import React, { useState, useEffect, useMemo } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, TextInput, Alert,
  KeyboardAvoidingView, Platform, Switch,
} from 'react-native';
import { Plus, Trash2, ChevronRight, ChevronLeft, FileDown, Search, X } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pdfOnizlemeAc } from '../../lib/pdfOnizleme';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/layout/AppBar';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useOnboarding } from '../../context/OnboardingContext';
import { supabase } from '../../lib/supabase';
import { Kazanim } from '../../lib/planUret';
import {
  SinavSoru, SinavOgrenci, SinavFormData, SinavSonuclari,
  STORAGE_SINAV_OKUL, STORAGE_SINAV_OGRETMEN, STORAGE_SINAV_OKUL_MUDURU,
  sinavOgrenciStorageKey, sinavSonuclariniHesapla, otomatikTedbirOner,
} from '../../data/sinavAnaliziSablon';
import { sinavAnaliziHtmlOlustur } from '../../data/sinavAnaliziHtmlSablon';
import {
  SinavArsivKaydi, arsiviYukle, arsiveKaydet, arsivdenSil, yeniArsivId,
} from '../../data/sinavArsiv';

type Props = NativeStackScreenProps<RootStackParamList, 'SinavAnalizi'>;

const ADIMLAR = ['Temel Bilgiler', 'Sorular', 'Öğrenciler', 'Puan Girişi', 'Sonuç'];

function bugunTarih(): string {
  const d  = new Date();
  const ay = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];
  return `${d.getDate()} ${ay[d.getMonth()]} ${d.getFullYear()}`;
}

function donemHesapla(): 1 | 2 {
  const ay = new Date().getMonth() + 1;
  return ay >= 9 || ay <= 1 ? 1 : 2;
}

function egitimYiliHesapla(): string {
  const y  = new Date().getFullYear();
  const ay = new Date().getMonth() + 1;
  return ay >= 9 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

function sinifSayisiniCikar(sinif: string): number | null {
  const m = sinif.match(/\d+/);
  return m ? parseInt(m[0], 10) : null;
}

let ogrenciIdSayaci = 0;

export function SinavAnaliziScreen({ navigation }: Props) {
  const { bransSlug, brans, okulTipi, siniflar, dersFiltesi } = useOnboarding();

  const [adim, setAdim] = useState(0);
  const [yukleniyor, setYukleniyor] = useState(false);

  // ─── Temel bilgiler ───────────────────────────────────────────────────
  const [okulAdi, setOkulAdi]     = useState('');
  const [sinif, setSinif]         = useState('');
  const [dersAdi, setDersAdi]     = useState(brans || '');
  const [donem, setDonem]         = useState<1 | 2>(donemHesapla());
  const [sinavNo, setSinavNo]     = useState('1');
  const [tarih, setTarih]         = useState(bugunTarih());
  const [ogretmenAdi, setOgretmenAdi] = useState('');
  const [okulMuduru, setOkulMuduru]   = useState('');

  // ─── Sorular & kazanımlar ─────────────────────────────────────────────
  const [sorular, setSorular] = useState<SinavSoru[]>([]);
  const [kazanimListesi, setKazanimListesi] = useState<Kazanim[]>([]);
  const [kazanimYukleniyor, setKazanimYukleniyor] = useState(false);
  const [kazanimSheetSoruNo, setKazanimSheetSoruNo] = useState<number | null>(null);

  // ─── Öğrenciler ───────────────────────────────────────────────────────
  const [ogrenciler, setOgrenciler] = useState<SinavOgrenci[]>([]);
  const [ogrencilerYuklendi, setOgrencilerYuklendi] = useState(false);

  // ─── Puanlar ──────────────────────────────────────────────────────────
  const [puanlar, setPuanlar] = useState<Record<number, Record<number, string>>>({});

  // ─── Sonuç ────────────────────────────────────────────────────────────
  const [tedbirler, setTedbirler] = useState<string[]>([]);
  const [tedbirlerOnerildi, setTedbirlerOnerildi] = useState(false);

  // Arşiv state (yerel)
  const [arsiv, setArsiv] = useState<SinavArsivKaydi[]>([]);
  const [arsivId, setArsivId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      AsyncStorage.getItem(STORAGE_SINAV_OKUL),
      AsyncStorage.getItem(STORAGE_SINAV_OGRETMEN),
      AsyncStorage.getItem(STORAGE_SINAV_OKUL_MUDURU),
    ]).then(([okul, ogretmen, mudur]) => {
      if (okul) setOkulAdi(okul);
      if (ogretmen) setOgretmenAdi(ogretmen);
      if (mudur) setOkulMuduru(mudur);
    });
  }, []);

  async function kazanimlariGetir() {
    setKazanimYukleniyor(true);
    try {
      const grade = sinifSayisiniCikar(sinif);
      let q = supabase.from('kazanimlar').select('id, kod, ad, unite, sinif, ders').order('unite').order('kod');
      if (grade !== null) {
        q = q.eq('sinif', grade);
        q = q.in('sinif_tipi', grade === 0 ? ['hazirlik'] : ['normal']);
      } else if (siniflar.length > 0) {
        q = q.in('sinif', siniflar);
        q = q.in('sinif_tipi', siniflar.includes(0) ? ['normal', 'hazirlik'] : ['normal']);
      }
      q = q.or(`brans.eq.${bransSlug},branslar.cs.{${bransSlug}}`);
      if (okulTipi) q = q.eq('okul_tipi', okulTipi);
      if (dersFiltesi && dersFiltesi.length > 0) q = q.in('ders', dersFiltesi);

      const { data, error } = await q;
      if (error) throw error;
      setKazanimListesi((data ?? []) as Kazanim[]);
    } catch (e) {
      console.warn('kazanimlariGetir hata:', e, { bransSlug, okulTipi, siniflar, dersFiltesi, sinif });
      setKazanimListesi([]);
    } finally {
      setKazanimYukleniyor(false);
    }
  }

  async function ogrencileriYukle() {
    const json = await AsyncStorage.getItem(sinavOgrenciStorageKey(sinif));
    if (json) {
      const kayitli = JSON.parse(json) as SinavOgrenci[];
      setOgrenciler(kayitli);
      ogrenciIdSayaci = Math.max(0, ...kayitli.map(o => o.no));
    }
    setOgrencilerYuklendi(true);
  }

  function soruEkle() {
    setSorular([...sorular, { no: sorular.length + 1, kazanimId: null, kazanimAd: '', puan: '10' }]);
  }

  function soruSil(no: number) {
    const kalan = sorular.filter(s => s.no !== no).map((s, i) => ({ ...s, no: i + 1 }));
    setSorular(kalan);
  }

  function ogrenciEkle() {
    ogrenciIdSayaci += 1;
    setOgrenciler([...ogrenciler, { no: ogrenciIdSayaci, ogrNo: '', adSoyad: '', girmedi: false }]);
  }

  function ogrenciSil(no: number) {
    setOgrenciler(ogrenciler.filter(o => o.no !== no));
  }

  function puanGuncelle(ogrenciNo: number, soruNo: number, deger: string) {
    setPuanlar(prev => ({
      ...prev,
      [ogrenciNo]: { ...prev[ogrenciNo], [soruNo]: deger },
    }));
  }

  const formData: SinavFormData = useMemo(() => ({
    okulAdi, sinif, dersAdi, egitimYili: egitimYiliHesapla(), donem, sinavNo, tarih,
    ogretmenAdi, okulMuduru, sorular, ogrenciler, puanlar, tedbirler,
  }), [okulAdi, sinif, dersAdi, donem, sinavNo, tarih, ogretmenAdi, okulMuduru, sorular, ogrenciler, puanlar, tedbirler]);

  const sonuclar: SinavSonuclari = useMemo(() => sinavSonuclariniHesapla(formData), [formData]);

  useEffect(() => {
    if (adim === 4 && !tedbirlerOnerildi) {
      setTedbirler(otomatikTedbirOner(sonuclar));
      setTedbirlerOnerildi(true);
    }
  }, [adim, tedbirlerOnerildi, sonuclar]);

  // Arşiv: yükle / kaydet / yeniden aç / sil
  useEffect(() => { arsiviYukle().then(setArsiv); }, []);

  function gosterToast(mesaj: string) {
    setToast(mesaj);
    setTimeout(() => setToast(null), 2200);
  }

  async function analiziArsivle() {
    const id = arsivId ?? yeniArsivId();
    if (!arsivId) setArsivId(id);
    const kayit: SinavArsivKaydi = {
      id,
      kayitTarihi: Date.now(),
      sinif, dersAdi, sinavNo, donem, tarih,
      genelBasariYuzdesi: sonuclar.genelBasariYuzdesi,
      form: formData,
    };
    await arsiveKaydet(kayit);
    setArsiv(await arsiviYukle());
  }

  function analiziAc(kayit: SinavArsivKaydi) {
    const f = kayit.form;
    setOkulAdi(f.okulAdi); setSinif(f.sinif); setDersAdi(f.dersAdi);
    setDonem(f.donem); setSinavNo(f.sinavNo); setTarih(f.tarih);
    setOgretmenAdi(f.ogretmenAdi); setOkulMuduru(f.okulMuduru);
    setSorular(f.sorular); setOgrenciler(f.ogrenciler); setPuanlar(f.puanlar);
    setTedbirler(f.tedbirler); setTedbirlerOnerildi(true);
    setOgrencilerYuklendi(true);
    setArsivId(kayit.id);
    setAdim(4);
  }

  async function analiziSil(id: string) {
    await arsivdenSil(id);
    setArsiv(await arsiviYukle());
    if (arsivId === id) setArsivId(null);
  }

  // Sonuç adımına gelince otomatik arşivle (upsert)
  useEffect(() => {
    if (adim === 4) {
      analiziArsivle().then(() => gosterToast('Analiz arşive kaydedildi'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adim]);

  function ileri() {
    if (adim === 0) {
      if (!okulAdi.trim() || !sinif.trim() || !dersAdi.trim()) {
        Alert.alert('Eksik bilgi', 'Okul adı, sınıf ve ders adı zorunlu.');
        return;
      }
      if (kazanimListesi.length === 0) kazanimlariGetir();
    }
    if (adim === 1) {
      if (sorular.length === 0) {
        Alert.alert('Eksik bilgi', 'En az bir soru eklemelisin.');
        return;
      }
      if (!ogrencilerYuklendi) ogrencileriYukle();
    }
    if (adim === 2 && ogrenciler.length === 0) {
      Alert.alert('Eksik bilgi', 'En az bir öğrenci eklemelisin.');
      return;
    }
    if (adim < ADIMLAR.length - 1) setAdim(adim + 1);
  }

  function geri() {
    setAdim(adim - 1);
  }

  async function disaAktar() {
    setYukleniyor(true);
    try {
      await AsyncStorage.setItem(STORAGE_SINAV_OKUL, okulAdi);
      await AsyncStorage.setItem(STORAGE_SINAV_OGRETMEN, ogretmenAdi);
      await AsyncStorage.setItem(STORAGE_SINAV_OKUL_MUDURU, okulMuduru);
      await AsyncStorage.setItem(sinavOgrenciStorageKey(sinif), JSON.stringify(ogrenciler));

      await analiziArsivle();

      const html = sinavAnaliziHtmlOlustur(formData, sonuclar);
      await pdfOnizlemeAc(html, false);
    } catch {
      Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <Screen bg={colors.surface}>
      <AppBar title="Sınav Analizi" back />

      <View style={s.stepper}>
        {ADIMLAR.map((a, i) => (
          <View key={i} style={s.stepItem}>
            <View style={[s.stepDot, i <= adim && s.stepDotActive]}>
              <Text style={[s.stepNo, i <= adim && s.stepNoActive]}>{i + 1}</Text>
            </View>
            <Text style={[s.stepLabel, i === adim && s.stepLabelActive]} numberOfLines={1}>{a}</Text>
          </View>
        ))}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {adim === 0 && (
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            {arsiv.length > 0 && (
              <View style={s.arsivPanel}>
                <Text style={s.arsivBaslik}>GEÇMİŞ ANALİZLER</Text>
                {arsiv.map(k => (
                  <View key={k.id} style={s.arsivRow}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => analiziAc(k)} activeOpacity={0.7}>
                      <Text style={s.arsivRowBaslik} numberOfLines={1}>{k.sinif} · {k.dersAdi}</Text>
                      <Text style={s.arsivRowAlt} numberOfLines={1}>
                        {k.donem}. dönem · {k.sinavNo}. sınav · {k.tarih} · %{k.genelBasariYuzdesi}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => analiziSil(k.id)} style={s.deleteBtn}>
                      <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                    </TouchableOpacity>
                  </View>
                ))}
                <Text style={s.arsivHint}>Yeni analiz için aşağıdaki formu doldur.</Text>
              </View>
            )}
            <Text style={s.adimBaslik}>Temel Bilgiler</Text>
            <Text style={s.adimAlt}>Sınav analizi başlık bilgileri</Text>

            <Alan label="Okul Adı" zorunlu>
              <TextInput style={s.input} value={okulAdi} onChangeText={setOkulAdi}
                placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
            </Alan>
            <Alan label="Sınıf" zorunlu hint="örn. 10/A, 5-B">
              <TextInput style={s.input} value={sinif} onChangeText={setSinif}
                placeholder="10/A" placeholderTextColor={colors.text3} autoCapitalize="characters" />
            </Alan>
            <Alan label="Ders Adı" zorunlu>
              <TextInput style={s.input} value={dersAdi} onChangeText={setDersAdi}
                placeholder="Matematik" placeholderTextColor={colors.text3} />
            </Alan>

            <Alan label="Dönem" zorunlu>
              <View style={s.chipRow}>
                {[1, 2].map(d => (
                  <TouchableOpacity
                    key={d}
                    style={[s.chip, donem === d && s.chipActive]}
                    onPress={() => setDonem(d as 1 | 2)}
                    activeOpacity={0.7}
                  >
                    <Text style={[s.chipText, donem === d && s.chipTextActive]}>{d}. Dönem</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Alan>

            <Alan label="Sınav No" zorunlu>
              <TextInput style={s.input} value={sinavNo} onChangeText={setSinavNo}
                placeholder="1" placeholderTextColor={colors.text3} keyboardType="numeric" />
            </Alan>
            <Alan label="Sınav Tarihi" zorunlu>
              <TextInput style={s.input} value={tarih} onChangeText={setTarih}
                placeholder="15 Kasım 2025" placeholderTextColor={colors.text3} />
            </Alan>

            <View style={s.infoCard}>
              <Text style={s.infoText}>
                Eğitim yılı: <Text style={s.infoVurgu}>{egitimYiliHesapla()}</Text>
                {'\n'}Bir sonraki adımda her soruyu kendi müfredat kazanımınla eşleştireceksin.
              </Text>
            </View>
          </ScrollView>
        )}

        {adim === 1 && (
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <Text style={s.adimBaslik}>Sorular & Kazanımlar</Text>
            <Text style={s.adimAlt}>Her soruyu bir kazanıma bağla, puan değerini gir</Text>

            {sorular.map(soru => (
              <View key={soru.no} style={s.soruCard}>
                <View style={s.soruHeader}>
                  <Text style={s.soruNo}>Soru {soru.no}</Text>
                  <TouchableOpacity onPress={() => soruSil(soru.no)} style={s.deleteBtn}>
                    <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  style={s.kazanimSecBtn}
                  onPress={() => setKazanimSheetSoruNo(soru.no)}
                  activeOpacity={0.7}
                >
                  <Text style={soru.kazanimAd ? s.kazanimSecMetin : s.kazanimSecPlaceholder} numberOfLines={2}>
                    {soru.kazanimAd || 'Kazanım seç...'}
                  </Text>
                  <ChevronRight size={14} color={colors.text3} strokeWidth={1.5} />
                </TouchableOpacity>
                <Alan label="Puan Değeri">
                  <TextInput
                    style={s.input}
                    value={soru.puan}
                    onChangeText={v => setSorular(sorular.map(x => x.no === soru.no ? { ...x, puan: v } : x))}
                    keyboardType="numeric"
                    placeholder="10"
                    placeholderTextColor={colors.text3}
                  />
                </Alan>
              </View>
            ))}

            <TouchableOpacity style={s.addBtn} onPress={soruEkle} activeOpacity={0.7}>
              <Plus size={16} color={colors.accent} strokeWidth={2} />
              <Text style={s.addBtnText}>Soru Ekle</Text>
            </TouchableOpacity>

            <View style={s.infoCard}>
              <Text style={s.infoText}>
                Toplam puan: <Text style={s.infoVurgu}>
                  {sorular.reduce((t, s2) => t + (parseFloat(s2.puan) || 0), 0)}
                </Text> / 100
              </Text>
            </View>
          </ScrollView>
        )}

        {adim === 2 && (
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <Text style={s.adimBaslik}>Öğrenci Listesi</Text>
            <Text style={s.adimAlt}>Bu liste sınıfa kayıtlı tutulur, sonraki sınavlarda otomatik gelir</Text>

            {ogrenciler.map((o, i) => (
              <View key={o.no} style={s.ogrenciRow}>
                <Text style={s.ogrenciSiraNo}>{i + 1}</Text>
                <View style={{ flex: 1, gap: 6 }}>
                  <TextInput
                    style={s.input}
                    value={o.ogrNo}
                    onChangeText={v => setOgrenciler(ogrenciler.map(x => x.no === o.no ? { ...x, ogrNo: v } : x))}
                    placeholder="Öğrenci No"
                    placeholderTextColor={colors.text3}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={s.input}
                    value={o.adSoyad}
                    onChangeText={v => setOgrenciler(ogrenciler.map(x => x.no === o.no ? { ...x, adSoyad: v } : x))}
                    placeholder="Adı Soyadı"
                    placeholderTextColor={colors.text3}
                  />
                </View>
                <TouchableOpacity onPress={() => ogrenciSil(o.no)} style={s.deleteBtn}>
                  <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            ))}

            <TouchableOpacity style={s.addBtn} onPress={ogrenciEkle} activeOpacity={0.7}>
              <Plus size={16} color={colors.accent} strokeWidth={2} />
              <Text style={s.addBtnText}>Öğrenci Ekle</Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        {adim === 3 && (
          <ScrollView contentContainerStyle={s.scroll}>
            <Text style={s.adimBaslik}>Puan Girişi</Text>
            <Text style={s.adimAlt}>Sınava girmeyen öğrencileri işaretle, diğerlerinin soru puanlarını gir</Text>

            <ScrollView horizontal showsHorizontalScrollIndicator>
              <View>
                <View style={s.tabloHeaderRow}>
                  <View style={[s.tabloHucre, s.tabloAdHucre]}><Text style={s.tabloHeaderText}>Öğrenci</Text></View>
                  {sorular.map(soru => (
                    <View key={soru.no} style={s.tabloHucre}><Text style={s.tabloHeaderText}>S{soru.no}</Text></View>
                  ))}
                  <View style={s.tabloHucre}><Text style={s.tabloHeaderText}>Toplam</Text></View>
                </View>

                {ogrenciler.map(o => (
                  <View key={o.no} style={s.tabloRow}>
                    <View style={[s.tabloHucre, s.tabloAdHucre]}>
                      <Text style={s.tabloAdText} numberOfLines={1}>{o.adSoyad || `Öğrenci ${o.no}`}</Text>
                      <TouchableOpacity
                        onPress={() => setOgrenciler(ogrenciler.map(x => x.no === o.no ? { ...x, girmedi: !x.girmedi } : x))}
                        style={s.girmediToggle}
                      >
                        <Switch
                          value={o.girmedi}
                          onValueChange={() => setOgrenciler(ogrenciler.map(x => x.no === o.no ? { ...x, girmedi: !x.girmedi } : x))}
                          trackColor={{ false: colors.border, true: colors.warning }}
                        />
                        <Text style={s.girmediText}>Girmedi</Text>
                      </TouchableOpacity>
                    </View>
                    {sorular.map(soru => (
                      <View key={soru.no} style={s.tabloHucre}>
                        <TextInput
                          style={[s.puanInput, o.girmedi && s.puanInputDisabled]}
                          value={puanlar[o.no]?.[soru.no] ?? ''}
                          onChangeText={v => puanGuncelle(o.no, soru.no, v)}
                          keyboardType="numeric"
                          editable={!o.girmedi}
                          placeholder="-"
                          placeholderTextColor={colors.text3}
                        />
                      </View>
                    ))}
                    <View style={s.tabloHucre}>
                      <Text style={s.toplamText}>{o.girmedi ? '—' : sonuclar.ogrenciToplamlari[o.no] ?? 0}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </ScrollView>
          </ScrollView>
        )}

        {adim === 4 && (
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <Text style={s.adimBaslik}>Sonuç & Dışa Aktar</Text>
            <Text style={s.adimAlt}>Kazanım bazlı başarı analizi otomatik hesaplandı</Text>

            <View style={s.ozetCard}>
              <Text style={s.ozetBuyukSayi}>%{sonuclar.genelBasariYuzdesi}</Text>
              <Text style={s.ozetAltYazi}>Genel Başarı Yüzdesi</Text>
              <View style={s.ozetSatir}>
                <Text style={s.ozetSatirText}>Sınava giren: {sonuclar.girenOgrenciSayisi}</Text>
                <Text style={s.ozetSatirText}>Girmeyen: {sonuclar.girmeyenOgrenciSayisi}</Text>
              </View>
            </View>

            <Text style={s.listBaslik}>KAZANIM BAŞARI ORANLARI</Text>
            {sonuclar.soruSonuclari.map(sonuc => (
              <View key={sonuc.soru.no} style={s.kazanimSonucRow}>
                <Text style={s.kazanimSonucBaslik} numberOfLines={1}>
                  S{sonuc.soru.no} · {sonuc.soru.kazanimAd || 'Kazanım seçilmedi'}
                </Text>
                <View style={s.barArkaPlan}>
                  <View style={[
                    s.barDolu,
                    { width: `${sonuc.basariYuzdesi}%`, backgroundColor: sonuc.basariYuzdesi < 50 ? colors.warning : colors.success },
                  ]} />
                </View>
                <Text style={s.kazanimSonucYuzde}>%{sonuc.basariYuzdesi}</Text>
              </View>
            ))}

            <Text style={[s.listBaslik, { marginTop: spacing.lg }]}>ALINACAK TEDBİRLER</Text>
            {tedbirler.map((t, i) => (
              <View key={i} style={s.tedbirRow}>
                <TextInput
                  style={[s.input, s.textArea]}
                  value={t}
                  onChangeText={v => setTedbirler(tedbirler.map((x, idx) => idx === i ? v : x))}
                  multiline
                />
                <TouchableOpacity onPress={() => setTedbirler(tedbirler.filter((_, idx) => idx !== i))} style={s.deleteBtn}>
                  <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity style={s.addBtn} onPress={() => setTedbirler([...tedbirler, ''])} activeOpacity={0.7}>
              <Plus size={16} color={colors.accent} strokeWidth={2} />
              <Text style={s.addBtnText}>Tedbir Ekle</Text>
            </TouchableOpacity>

            <Alan label="Ders Öğretmeni">
              <TextInput style={s.input} value={ogretmenAdi} onChangeText={setOgretmenAdi}
                placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
            </Alan>
            <Alan label="Okul Müdürü">
              <TextInput style={s.input} value={okulMuduru} onChangeText={setOkulMuduru}
                placeholder="Ad Soyad" placeholderTextColor={colors.text3} />
            </Alan>
          </ScrollView>
        )}
      </KeyboardAvoidingView>

      <View style={s.altBar}>
        {adim > 0 ? (
          <TouchableOpacity style={s.geriBtn} onPress={geri} activeOpacity={0.7}>
            <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
            <Text style={s.geriBtnText}>Geri</Text>
          </TouchableOpacity>
        ) : <View />}

        {adim < ADIMLAR.length - 1 ? (
          <TouchableOpacity style={s.ileriBtn} onPress={ileri} activeOpacity={0.85}>
            <Text style={s.ileriBtnText}>İleri</Text>
            <ChevronRight size={18} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[s.ileriBtn, yukleniyor && s.ileriDisabled]}
            onPress={disaAktar}
            disabled={yukleniyor}
            activeOpacity={0.85}
          >
            <FileDown size={18} color="#fff" strokeWidth={2} />
            <Text style={s.ileriBtnText}>{yukleniyor ? 'Hazırlanıyor...' : 'Yazdırmaya hazır indir'}</Text>
          </TouchableOpacity>
        )}
      </View>

      <KazanimSheet
        visible={kazanimSheetSoruNo !== null}
        kazanimlar={kazanimListesi}
        yukleniyor={kazanimYukleniyor}
        onClose={() => setKazanimSheetSoruNo(null)}
        onSelect={(k) => {
          setSorular(sorular.map(x => x.no === kazanimSheetSoruNo ? { ...x, kazanimId: k.id, kazanimAd: k.ad } : x));
          setKazanimSheetSoruNo(null);
        }}
      />

      {toast && (
        <View style={s.toast} pointerEvents="none">
          <Text style={s.toastText}>{toast}</Text>
        </View>
      )}
    </Screen>
  );
}

function KazanimSheet({
  visible, kazanimlar, yukleniyor, onClose, onSelect,
}: {
  visible: boolean;
  kazanimlar: Kazanim[];
  yukleniyor: boolean;
  onClose: () => void;
  onSelect: (k: Kazanim) => void;
}) {
  const [query, setQuery] = useState('');
  if (!visible) return null;

  const filtered = kazanimlar.filter(k =>
    k.ad.toLowerCase().includes(query.toLowerCase()) ||
    k.kod.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <View style={s.sheetOverlay}>
      <TouchableOpacity style={StyleSheet.absoluteFillObject as any} onPress={onClose} activeOpacity={1} />
      <View style={s.sheet}>
        <View style={s.sheetHandle} />
        <Text style={s.sheetTitle}>Kazanım Seç</Text>

        <View style={s.sheetSearchRow}>
          <Search size={15} color={colors.text3} strokeWidth={1.5} />
          <TextInput
            style={s.sheetSearchInput}
            placeholder="Kazanım ara..."
            placeholderTextColor={colors.text3}
            value={query}
            onChangeText={setQuery}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X size={14} color={colors.text3} strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled" style={{ maxHeight: 420 }}>
          {yukleniyor ? (
            <Text style={s.sheetEmptyText}>Kazanımlar yükleniyor...</Text>
          ) : filtered.length === 0 ? (
            <Text style={s.sheetEmptyText}>Kazanım bulunamadı.</Text>
          ) : (
            filtered.map(k => (
              <TouchableOpacity key={k.id} style={s.sheetRow} onPress={() => onSelect(k)} activeOpacity={0.7}>
                <Text style={s.sheetRowKod}>{k.kod}</Text>
                <Text style={s.sheetRowText} numberOfLines={2}>{k.ad}</Text>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 32 }} />
        </ScrollView>
      </View>
    </View>
  );
}

function Alan({ label, zorunlu, hint, children }: {
  label: string; zorunlu?: boolean; hint?: string; children: React.ReactNode;
}) {
  return (
    <View style={s.alan}>
      <Text style={s.alanLabel}>{label}{zorunlu && <Text style={{ color: colors.accent }}> *</Text>}</Text>
      {hint && <Text style={s.alanHint}>{hint}</Text>}
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { padding: spacing.base, paddingBottom: 32 } as ViewStyle,
  adimBaslik: { fontSize: 20, fontFamily: fonts.bold, color: colors.text1, marginBottom: 4 } as TextStyle,
  adimAlt: { fontSize: 13, fontFamily: fonts.regular, color: colors.text2, marginBottom: spacing.xl } as TextStyle,

  alan: { marginBottom: spacing.md } as ViewStyle,
  alanLabel: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.text1, marginBottom: 6 } as TextStyle,
  alanHint: { fontSize: 11, fontFamily: fonts.regular, color: colors.text3, marginBottom: 4 } as TextStyle,
  input: {
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text1,
  } as TextStyle,
  textArea: { flex: 1, minHeight: 56, textAlignVertical: 'top', paddingTop: 10 } as TextStyle,

  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' } as ViewStyle,
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.bg,
  } as ViewStyle,
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent } as ViewStyle,
  chipText: { fontSize: 13, fontFamily: fonts.medium, color: colors.text2 } as TextStyle,
  chipTextActive: { color: '#fff', fontFamily: fonts.semiBold } as TextStyle,

  infoCard: {
    backgroundColor: colors.bg, borderRadius: radius.md,
    padding: spacing.md, marginTop: spacing.md,
  } as ViewStyle,
  infoText: { fontSize: 12, fontFamily: fonts.regular, color: colors.text2, lineHeight: 18 } as TextStyle,
  infoVurgu: { fontFamily: fonts.semiBold, color: colors.accent } as TextStyle,

  listBaslik: {
    fontSize: 11, fontFamily: fonts.bold, color: colors.text3, letterSpacing: 0.8,
    marginBottom: spacing.md,
  } as TextStyle,

  deleteBtn: { padding: 8, alignSelf: 'flex-start' } as ViewStyle,
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 12, justifyContent: 'center',
    borderRadius: radius.btn, borderWidth: 1, borderColor: colors.accent, borderStyle: 'dashed',
    marginBottom: spacing.md,
  } as ViewStyle,
  addBtnText: { fontSize: 14, fontFamily: fonts.semiBold, color: colors.accent } as TextStyle,

  soruCard: {
    backgroundColor: colors.bg, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md, gap: spacing.sm,
  } as ViewStyle,
  soruHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } as ViewStyle,
  soruNo: { fontSize: 14, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,
  kazanimSecBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.sm,
    backgroundColor: colors.surface, borderRadius: radius.btn, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: 12,
  } as ViewStyle,
  kazanimSecMetin: { flex: 1, fontSize: 13, fontFamily: fonts.medium, color: colors.text1 } as TextStyle,
  kazanimSecPlaceholder: { flex: 1, fontSize: 13, fontFamily: fonts.regular, color: colors.text3 } as TextStyle,

  ogrenciRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.sm,
  } as ViewStyle,
  ogrenciSiraNo: {
    fontSize: 12, fontFamily: fonts.bold, color: colors.text3,
    width: 20, textAlign: 'center', marginTop: 14,
  } as TextStyle,

  tabloHeaderRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, paddingBottom: spacing.sm } as ViewStyle,
  tabloRow: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, borderBottomColor: colors.border, paddingVertical: spacing.sm } as ViewStyle,
  tabloHucre: { width: 64, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 } as ViewStyle,
  tabloAdHucre: { width: 160, alignItems: 'flex-start', gap: 4 } as ViewStyle,
  tabloHeaderText: { fontSize: 11, fontFamily: fonts.bold, color: colors.text3, textAlign: 'center' } as TextStyle,
  tabloAdText: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.text1 } as TextStyle,
  girmediToggle: { flexDirection: 'row', alignItems: 'center', gap: 6 } as ViewStyle,
  girmediText: { fontSize: 11, fontFamily: fonts.medium, color: colors.text3 } as TextStyle,
  puanInput: {
    width: 52, textAlign: 'center',
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    paddingVertical: 8, fontSize: 13, fontFamily: fonts.medium, color: colors.text1,
  } as TextStyle,
  puanInputDisabled: { backgroundColor: colors.bg, color: colors.text3 } as TextStyle,
  toplamText: { fontSize: 13, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,

  ozetCard: {
    backgroundColor: colors.bg, borderRadius: radius.card,
    padding: spacing.xl, alignItems: 'center', marginBottom: spacing.xl,
  } as ViewStyle,
  ozetBuyukSayi: { fontSize: 40, fontFamily: fonts.extraBold, color: colors.accent } as TextStyle,
  ozetAltYazi: { fontSize: 13, fontFamily: fonts.medium, color: colors.text2, marginTop: 2 } as TextStyle,
  ozetSatir: { flexDirection: 'row', gap: spacing.xl, marginTop: spacing.md } as ViewStyle,
  ozetSatirText: { fontSize: 12, fontFamily: fonts.medium, color: colors.text2 } as TextStyle,

  kazanimSonucRow: { marginBottom: spacing.md } as ViewStyle,
  kazanimSonucBaslik: { fontSize: 12, fontFamily: fonts.medium, color: colors.text1, marginBottom: 6 } as TextStyle,
  barArkaPlan: { height: 8, borderRadius: 4, backgroundColor: colors.border, overflow: 'hidden' } as ViewStyle,
  barDolu: { height: 8, borderRadius: 4 } as ViewStyle,
  kazanimSonucYuzde: { fontSize: 11, fontFamily: fonts.semiBold, color: colors.text2, marginTop: 4, textAlign: 'right' } as TextStyle,

  tedbirRow: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm, marginBottom: spacing.sm } as ViewStyle,

  stepper: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  } as ViewStyle,
  stepItem: { alignItems: 'center', flex: 1 } as ViewStyle,
  stepDot: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  } as ViewStyle,
  stepDotActive: { backgroundColor: colors.accent } as ViewStyle,
  stepNo: { fontSize: 11, fontFamily: fonts.bold, color: colors.text3 } as TextStyle,
  stepNoActive: { color: '#fff' } as TextStyle,
  stepLabel: { fontSize: 9, fontFamily: fonts.medium, color: colors.text3, textAlign: 'center' } as TextStyle,
  stepLabelActive: { color: colors.accent } as TextStyle,

  altBar: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.base, paddingVertical: spacing.md,
    borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.surface,
  } as ViewStyle,
  geriBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 12, paddingHorizontal: spacing.md,
  } as ViewStyle,
  geriBtnText: { fontSize: 15, fontFamily: fonts.semiBold, color: colors.text1 } as TextStyle,
  ileriBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.accent, borderRadius: radius.btn,
    paddingVertical: 12, paddingHorizontal: spacing.xl,
  } as ViewStyle,
  ileriDisabled: { opacity: 0.6 } as ViewStyle,
  ileriBtnText: { fontSize: 15, fontFamily: fonts.bold, color: '#fff' } as TextStyle,

  sheetOverlay: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.42)',
    justifyContent: 'flex-end', zIndex: 50,
  } as ViewStyle,
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '80%', paddingBottom: spacing.lg,
  } as ViewStyle,
  sheetHandle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border,
    alignSelf: 'center', marginTop: 10, marginBottom: 6,
  } as ViewStyle,
  sheetTitle: {
    fontSize: 16, fontFamily: fonts.bold, color: colors.text1,
    paddingHorizontal: spacing.base, paddingBottom: spacing.sm,
  } as TextStyle,
  sheetSearchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.base, marginBottom: spacing.sm,
    backgroundColor: colors.bg, borderRadius: radius.btn,
    paddingHorizontal: spacing.md, paddingVertical: 10, gap: spacing.sm,
  } as ViewStyle,
  sheetSearchInput: {
    flex: 1, fontSize: 14, fontFamily: fonts.regular, color: colors.text1, padding: 0,
  } as TextStyle,
  sheetRow: {
    paddingHorizontal: spacing.base, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: 2,
  } as ViewStyle,
  sheetRowKod: { fontSize: 11, fontFamily: fonts.bold, color: colors.accent } as TextStyle,
  sheetRowText: { fontSize: 13, fontFamily: fonts.medium, color: colors.text1 } as TextStyle,
  sheetEmptyText: {
    fontSize: 14, fontFamily: fonts.regular, color: colors.text3,
    textAlign: 'center', marginTop: spacing.xl,
  } as TextStyle,

  arsivPanel: {
    backgroundColor: colors.bg, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.xl,
  } as ViewStyle,
  arsivBaslik: {
    fontSize: 11, fontFamily: fonts.bold, color: colors.text3,
    letterSpacing: 0.8, marginBottom: 4,
  } as TextStyle,
  arsivRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    paddingVertical: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border,
  } as ViewStyle,
  arsivRowBaslik: { fontSize: 14, fontFamily: fonts.semiBold, color: colors.text1 } as TextStyle,
  arsivRowAlt: { fontSize: 11, fontFamily: fonts.regular, color: colors.text2, marginTop: 2 } as TextStyle,
  arsivHint: { fontSize: 11, fontFamily: fonts.regular, color: colors.text3, marginTop: spacing.sm } as TextStyle,

  toast: {
    position: 'absolute', bottom: 84, alignSelf: 'center',
    backgroundColor: colors.text1, borderRadius: radius.btn,
    paddingHorizontal: spacing.lg, paddingVertical: 10,
  } as ViewStyle,
  toastText: { fontSize: 13, fontFamily: fonts.semiBold, color: '#fff' } as TextStyle,
});
