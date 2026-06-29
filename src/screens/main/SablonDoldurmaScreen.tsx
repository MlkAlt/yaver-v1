import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, TextInput, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Plus, Trash2, ChevronRight, ChevronLeft, FileDown, RotateCcw } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/layout/AppBar';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { getBransListesi, GUNDEM_MADDELERI } from '../../data/sokSablon';
import { sokHtmlOlustur, SokFormData } from '../../data/sokHtmlSablon';

type Props = NativeStackScreenProps<RootStackParamList, 'SablonDoldurma'>;
type OkulTipi = 'ilkokul' | 'ortaokul' | 'lise' | 'ihl';

const STORAGE_OGRETMENLER = '@yaver/sok_ogretmenler';
const STORAGE_OKUL        = '@yaver/okul_adi';
const STORAGE_OKUL_TIPI   = '@yaver/okul_tipi';
const STORAGE_SINIF       = '@yaver/sok_sinif';

const OKUL_TIPLERI: { key: OkulTipi; label: string }[] = [
  { key: 'ilkokul',  label: 'İlkokul'  },
  { key: 'ortaokul', label: 'Ortaokul' },
  { key: 'lise',     label: 'Lise'     },
  { key: 'ihl',      label: 'İHL'      },
];

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

function varsayilanListeOlustur(okulTipi: OkulTipi) {
  return getBransListesi(okulTipi).map(b => ({ brans: b.brans, ad: '' }));
}

// ─── ADIM 1: Temel Bilgiler ───────────────────────────────────────────────
function AdimTemelBilgi({
  okulAdi, setOkulAdi,
  sinif, setSinif,
  tarih, setTarih,
  saat, setSaat,
  okulTipi, setOkulTipi,
}: {
  okulAdi: string;  setOkulAdi: (v: string) => void;
  sinif: string;    setSinif: (v: string) => void;
  tarih: string;    setTarih: (v: string) => void;
  saat: string;     setSaat: (v: string) => void;
  okulTipi: OkulTipi; setOkulTipi: (v: OkulTipi) => void;
}) {
  return (
    <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
      <Text style={s.adimBaslik}>Temel Bilgiler</Text>
      <Text style={s.adimAlt}>Belge başlığı ve meta bilgileri</Text>

      <Alan label="Okul Türü" zorunlu>
        <View style={s.chipRow}>
          {OKUL_TIPLERI.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[s.chip, okulTipi === t.key && s.chipActive]}
              onPress={() => setOkulTipi(t.key)}
              activeOpacity={0.7}
            >
              <Text style={[s.chipText, okulTipi === t.key && s.chipTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </Alan>

      <Alan label="Okul Adı" zorunlu>
        <TextInput style={s.input} value={okulAdi} onChangeText={setOkulAdi}
          placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
      </Alan>
      <Alan label="Sınıf" zorunlu hint="örn. 10/A, 5-B">
        <TextInput style={s.input} value={sinif} onChangeText={setSinif}
          placeholder="10/A" placeholderTextColor={colors.text3} autoCapitalize="characters" />
      </Alan>
      <Alan label="Toplantı Tarihi" zorunlu>
        <TextInput style={s.input} value={tarih} onChangeText={setTarih}
          placeholder="15 Kasım 2025" placeholderTextColor={colors.text3} />
      </Alan>
      <Alan label="Saat" zorunlu>
        <TextInput style={s.input} value={saat} onChangeText={setSaat}
          placeholder="14:30" placeholderTextColor={colors.text3} keyboardType="numeric" />
      </Alan>

      <View style={s.infoCard}>
        <Text style={s.infoText}>
          Dönem ve eğitim yılı tarihe göre otomatik belirlendi:{' '}
          <Text style={s.infoVurgu}>{egitimYiliHesapla()} — {donemHesapla() === 1 ? 'I. Dönem' : 'II. Dönem'}</Text>
        </Text>
      </View>
    </ScrollView>
  );
}

// ─── ADIM 2: Öğretmenler ─────────────────────────────────────────────────
function AdimOgretmenler({
  rehber, setRehber,
  ogretmenler, setOgretmenler,
  okulTipi,
}: {
  rehber: string; setRehber: (v: string) => void;
  ogretmenler: { brans: string; ad: string }[];
  setOgretmenler: (v: { brans: string; ad: string }[]) => void;
  okulTipi: OkulTipi;
}) {
  const update = (i: number, key: 'brans' | 'ad', val: string) => {
    const next = [...ogretmenler];
    next[i] = { ...next[i], [key]: val };
    setOgretmenler(next);
  };
  const remove = (i: number) => setOgretmenler(ogretmenler.filter((_, idx) => idx !== i));
  const add    = () => setOgretmenler([...ogretmenler, { brans: '', ad: '' }]);

  const sifirla = () => {
    Alert.alert(
      'Listeyi Sıfırla',
      `${OKUL_TIPLERI.find(t => t.key === okulTipi)?.label} için standart branş listesine dön. Girdiğin isimler silinecek.`,
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Sıfırla', style: 'destructive', onPress: () => setOgretmenler(varsayilanListeOlustur(okulTipi)) },
      ],
    );
  };

  return (
    <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
      <Text style={s.adimBaslik}>Katılımcılar</Text>
      <Text style={s.adimAlt}>Toplantıya katılan öğretmenler</Text>

      <Alan label="Sınıf Rehber Öğretmeni (siz)" zorunlu>
        <TextInput style={s.input} value={rehber} onChangeText={setRehber}
          placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
      </Alan>

      <View style={s.listHeader}>
        <Text style={s.listBaslik}>DİĞER ÖĞRETMENLER</Text>
        <TouchableOpacity onPress={sifirla} style={s.sifirlaBtn} activeOpacity={0.7}>
          <RotateCcw size={12} color={colors.text3} strokeWidth={2} />
          <Text style={s.sifirlaBtnText}>Varsayılana sıfırla</Text>
        </TouchableOpacity>
      </View>

      {ogretmenler.map((o, i) => (
        <View key={i} style={s.ogretmenRow}>
          <View style={{ flex: 1, gap: 6 }}>
            <TextInput
              style={s.input}
              value={o.brans}
              onChangeText={v => update(i, 'brans', v)}
              placeholder="Branş"
              placeholderTextColor={colors.text3}
            />
            <TextInput
              style={s.input}
              value={o.ad}
              onChangeText={v => update(i, 'ad', v)}
              placeholder="Ad Soyad"
              placeholderTextColor={colors.text3}
            />
          </View>
          <TouchableOpacity onPress={() => remove(i)} style={s.deleteBtn}>
            <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={s.addBtn} onPress={add} activeOpacity={0.7}>
        <Plus size={16} color={colors.accent} strokeWidth={2} />
        <Text style={s.addBtnText}>Öğretmen Ekle</Text>
      </TouchableOpacity>

      <View style={s.infoCard}>
        <Text style={s.infoText}>Liste kaydedilir. Bir sonraki toplantıda sadece değişenleri güncellersin.</Text>
      </View>
    </ScrollView>
  );
}

// ─── ADIM 3: Gündem Notları ───────────────────────────────────────────────
function AdimGundem({
  notlar, setNotlar,
}: {
  notlar: Record<number, string>;
  setNotlar: (v: Record<number, string>) => void;
}) {
  const guncelle  = (no: number, val: string) => setNotlar({ ...notlar, [no]: val });
  const ozelMaddeler = GUNDEM_MADDELERI.filter(m => !m.sabit);

  return (
    <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
      <Text style={s.adimBaslik}>Gündem Notları</Text>
      <Text style={s.adimAlt}>Boş bıraktığın maddeler standart metinle doldurulur</Text>

      {ozelMaddeler.map(madde => (
        <View key={madde.no} style={s.gundemItem}>
          <Text style={s.gundemNo}>{madde.no}. {madde.baslik}</Text>
          <TextInput
            style={[s.input, s.textArea]}
            value={notlar[madde.no] || ''}
            onChangeText={v => guncelle(madde.no, v)}
            placeholder="Toplantıda konuşulanları kısaca yaz (boş = standart metin)"
            placeholderTextColor={colors.text3}
            multiline
            numberOfLines={3}
          />
        </View>
      ))}
    </ScrollView>
  );
}

// ─── ANA EKRAN ────────────────────────────────────────────────────────────
export function SablonDoldurmaScreen({ route, navigation }: Props) {
  const { sablonId, sablonAdi } = route.params;
  const isSok = sablonId === 'sok';

  const [adim, setAdim]               = useState(0);
  const [okulAdi, setOkulAdi]         = useState('');
  const [okulTipi, setOkulTipi]       = useState<OkulTipi>('lise');
  const [sinif, setSinif]             = useState('');
  const [tarih, setTarih]             = useState(bugunTarih());
  const [saat, setSaat]               = useState('14:30');
  const [rehber, setRehber]           = useState('');
  const [ogretmenler, setOgretmenler] = useState<{ brans: string; ad: string }[]>([]);
  const [gundemNotlari, setGundemNotlari] = useState<Record<number, string>>({});
  const [yukleniyor, setYukleniyor]   = useState(false);

  useEffect(() => {
    if (!isSok) return;
    Promise.all([
      AsyncStorage.getItem(STORAGE_OKUL),
      AsyncStorage.getItem(STORAGE_OKUL_TIPI),
      AsyncStorage.getItem(STORAGE_OGRETMENLER),
      AsyncStorage.getItem(STORAGE_SINIF),
    ]).then(([okul, tipi, ogretmenlerJson, sinifKayitli]) => {
      if (okul) setOkulAdi(okul);
      if (sinifKayitli) setSinif(sinifKayitli);
      const savedTipi = (tipi as OkulTipi) || 'lise';
      if (tipi) setOkulTipi(savedTipi);
      if (ogretmenlerJson) {
        setOgretmenler(JSON.parse(ogretmenlerJson));
      } else {
        setOgretmenler(varsayilanListeOlustur(savedTipi));
      }
    });
  }, []);

  if (!isSok) {
    return (
      <Screen bg={colors.surface}>
        <AppBar title={sablonAdi} back />
        <ScrollView contentContainerStyle={s.scroll}>
          <View style={s.infoCard}>
            <Text style={s.infoText}>Bu şablon yakında eklenecek.</Text>
          </View>
        </ScrollView>
      </Screen>
    );
  }

  const ADIMLAR = ['Temel Bilgiler', 'Katılımcılar', 'Gündem Notları'];

  const ileri = () => {
    if (adim === 0 && (!okulAdi.trim() || !sinif.trim())) {
      Alert.alert('Eksik bilgi', 'Okul adı ve sınıf zorunlu.');
      return;
    }
    if (adim === 1 && !rehber.trim()) {
      Alert.alert('Eksik bilgi', 'Rehber öğretmen adı zorunlu.');
      return;
    }
    if (adim < ADIMLAR.length - 1) setAdim(adim + 1);
    else olustur();
  };
  const geri = () => setAdim(adim - 1);

  async function olustur() {
    setYukleniyor(true);
    try {
      await AsyncStorage.setItem(STORAGE_OKUL, okulAdi);
      await AsyncStorage.setItem(STORAGE_OKUL_TIPI, okulTipi);
      await AsyncStorage.setItem(STORAGE_SINIF, sinif);
      await AsyncStorage.setItem(STORAGE_OGRETMENLER, JSON.stringify(ogretmenler));

      const formData: SokFormData = {
        okulAdi,
        sinif,
        okulTipi,
        egitimYili: egitimYiliHesapla(),
        donem: donemHesapla(),
        tarih,
        saat,
        rehberOgretmeni: rehber,
        ogretmenler,
        gundemNotlari,
      };

      const html      = sokHtmlOlustur(formData);
      const { uri }   = await Print.printToFileAsync({
        html,
        base64: false,
        margins: { top: 98, right: 118, bottom: 98, left: 118 },
      });
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: `ŞÖK Tutanağı — ${sinif}`,
        UTI: 'com.adobe.pdf',
      });
    } catch (e) {
      Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
    } finally {
      setYukleniyor(false);
    }
  }

  return (
    <Screen bg={colors.surface}>
      <AppBar title="ŞÖK Tutanağı" back />

      <View style={s.stepper}>
        {ADIMLAR.map((a, i) => (
          <View key={i} style={s.stepItem}>
            <View style={[s.stepDot, i <= adim && s.stepDotActive]}>
              <Text style={[s.stepNo, i <= adim && s.stepNoActive]}>{i + 1}</Text>
            </View>
            <Text style={[s.stepLabel, i === adim && s.stepLabelActive]}>{a}</Text>
          </View>
        ))}
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {adim === 0 && (
          <AdimTemelBilgi
            okulAdi={okulAdi} setOkulAdi={setOkulAdi}
            sinif={sinif} setSinif={setSinif}
            tarih={tarih} setTarih={setTarih}
            saat={saat} setSaat={setSaat}
            okulTipi={okulTipi} setOkulTipi={setOkulTipi}
          />
        )}
        {adim === 1 && (
          <AdimOgretmenler
            rehber={rehber} setRehber={setRehber}
            ogretmenler={ogretmenler} setOgretmenler={setOgretmenler}
            okulTipi={okulTipi}
          />
        )}
        {adim === 2 && (
          <AdimGundem notlar={gundemNotlari} setNotlar={setGundemNotlari} />
        )}
      </KeyboardAvoidingView>

      <View style={s.altBar}>
        {adim > 0 ? (
          <TouchableOpacity style={s.geriBtn} onPress={geri} activeOpacity={0.7}>
            <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
            <Text style={s.geriBtnText}>Geri</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <TouchableOpacity
          style={[s.ileriBtn, yukleniyor && s.ileriDisabled]}
          onPress={ileri}
          activeOpacity={0.8}
          disabled={yukleniyor}
        >
          {adim === ADIMLAR.length - 1 ? (
            <>
              <FileDown size={18} color="#fff" strokeWidth={2} />
              <Text style={s.ileriBtnText}>{yukleniyor ? 'Oluşturuluyor...' : 'Evrakı Oluştur'}</Text>
            </>
          ) : (
            <>
              <Text style={s.ileriBtnText}>İleri</Text>
              <ChevronRight size={18} color="#fff" strokeWidth={2} />
            </>
          )}
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

// ─── Alan bileşeni ────────────────────────────────────────────────────────
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
    borderRadius: radius.btn,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 12,
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text1,
  } as TextStyle,
  textArea: { minHeight: 72, textAlignVertical: 'top', paddingTop: 10 } as TextStyle,

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

  listHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: spacing.md, marginTop: spacing.sm,
  } as ViewStyle,
  listBaslik: {
    fontSize: 11, fontFamily: fonts.bold, color: colors.text3, letterSpacing: 0.8,
  } as TextStyle,
  sifirlaBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingVertical: 4, paddingHorizontal: 8,
  } as ViewStyle,
  sifirlaBtnText: { fontSize: 11, fontFamily: fonts.medium, color: colors.text3 } as TextStyle,

  ogretmenRow: {
    flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm,
    marginBottom: spacing.md,
    backgroundColor: colors.bg, borderRadius: radius.md, padding: spacing.sm,
  } as ViewStyle,
  deleteBtn: { padding: 8, marginTop: 4, alignSelf: 'flex-start' } as ViewStyle,
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 12, justifyContent: 'center',
    borderRadius: radius.btn, borderWidth: 1, borderColor: colors.accent, borderStyle: 'dashed',
  } as ViewStyle,
  addBtnText: { fontSize: 14, fontFamily: fonts.semiBold, color: colors.accent } as TextStyle,

  gundemItem: { marginBottom: spacing.md } as ViewStyle,
  gundemNo: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.text1, marginBottom: 6 } as TextStyle,

  stepper: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingHorizontal: spacing.xl, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  } as ViewStyle,
  stepItem: { alignItems: 'center', flex: 1 } as ViewStyle,
  stepDot: {
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.border, alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  } as ViewStyle,
  stepDotActive: { backgroundColor: colors.accent } as ViewStyle,
  stepNo: { fontSize: 12, fontFamily: fonts.bold, color: colors.text3 } as TextStyle,
  stepNoActive: { color: '#fff' } as TextStyle,
  stepLabel: { fontSize: 10, fontFamily: fonts.medium, color: colors.text3, textAlign: 'center' } as TextStyle,
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
});
