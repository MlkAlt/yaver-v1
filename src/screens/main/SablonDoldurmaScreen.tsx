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
import { ZUMRE_GUNDEM_MADDELERI, TOPLANTI_TIPLERI, ZumleToplantTipi } from '../../data/zumreSablon';
import { zumreHtmlOlustur, ZumreFormData } from '../../data/zumreHtmlSablon';
import { VELI_GUNDEM_MADDELERI, VELI_DONEM_TIPLERI, VeliDonem } from '../../data/veliSablon';
import { veliHtmlOlustur, VeliFormData } from '../../data/veliHtmlSablon';
import { KulupEtkinlikSatiri, bosEtkinlikSatiri, ToplumHizmetSatiri, bosToplumHizmetSatiri } from '../../data/kulupSablon';
import { kulupYillikPlanHtmlOlustur, KulupFormData } from '../../data/kulupHtmlSablon';
import { kulupVarsayilanEtkinlikleri, kulupVarsayilanToplumHizmetSatirlari } from '../../data/kulupYillikPlanlari';
import { RAPOR_AYLARI, planEtkinlikleriniRaporaCevir, aylikRaporHtmlOlustur, AylikRaporFormData } from '../../data/aylikRaporHtmlSablon';
import { toplumHizmetHtmlOlustur, ToplumHizmetFormData } from '../../data/toplumHizmetHtmlSablon';
import { turkceBuyuk } from '../../lib/turkce';

type Props = NativeStackScreenProps<RootStackParamList, 'SablonDoldurma'>;
type OkulTipi = 'ilkokul' | 'ortaokul' | 'lise' | 'ihl';

const STORAGE_OGRETMENLER      = '@yaver/sok_ogretmenler';
const STORAGE_OKUL             = '@yaver/okul_adi';
const STORAGE_OKUL_TIPI        = '@yaver/okul_tipi';
const STORAGE_SINIF            = '@yaver/sok_sinif';
const STORAGE_KULLANICI_ADI    = '@yaver/kullanici_adi';
const STORAGE_ZUMRE_BRANS      = '@yaver/zumre_brans';
const STORAGE_ZUMRE_OGRETMENLER= '@yaver/zumre_ogretmenler';
const STORAGE_ZUMRE_MUDUR      = '@yaver/zumre_mudur';
const STORAGE_ZUMRE_MUDUR_YARD = '@yaver/zumre_mudur_yard';
const STORAGE_VELI_OGRETMENLER = '@yaver/veli_ogretmenler';

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
  const isSok        = sablonId === 'sok';
  const isZumre      = sablonId === 'zumre';
  const isVeli       = sablonId === 'veli';
  const isKulup      = sablonId === 'kulup';
  const isAylikRapor = sablonId === 'aylik_rapor';
  const isToplumHizmet = sablonId === 'toplum_hizmet';

  // ─── ŞÖK state ────────────────────────────────────────────────────────
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

  // ─── Zümre state ──────────────────────────────────────────────────────
  const [zAdim, setZAdim]             = useState(0);
  const [zOkulAdi, setZOkulAdi]       = useState('');
  const [zBrans, setZBrans]           = useState('');
  const [zTipi, setZTipi]            = useState<ZumleToplantTipi>('sene_basi');
  const [zTarih, setZTarih]          = useState(bugunTarih());
  const [zSaat, setZSaat]            = useState('14:30');
  const [zBaskan, setZBaskan]        = useState('');
  const [zMudur, setZMudur]          = useState('');
  const [zMudurYard, setZMudurYard]  = useState('');
  const [zOgretmenler, setZOgretmenler] = useState<{ ad: string }[]>([]);
  const [zNotlar, setZNotlar]        = useState<Record<number, string>>({});
  const [zYukleniyor, setZYukleniyor]= useState(false);

  // ─── Veli state ───────────────────────────────────────────────────────
  const [vAdim, setVAdim]             = useState(0);
  const [vOkulAdi, setVOkulAdi]       = useState('');
  const [vSinif, setVSinif]           = useState('');
  const [vDonem, setVDonem]           = useState<VeliDonem>('donem1');
  const [vTarih, setVTarih]           = useState(bugunTarih());
  const [vSaat, setVSaat]             = useState('17:00');
  const [vRehber, setVRehber]         = useState('');
  const [vMudur, setVMudur]           = useState('');
  const [vMudurYard, setVMudurYard]   = useState('');
  const [vOgretmenler, setVOgretmenler] = useState<{ brans: string; ad: string }[]>([]);
  const [vNotlar, setVNotlar]         = useState<Record<number, string>>({});
  const [vYukleniyor, setVYukleniyor] = useState(false);

  // ─── Aylık Rapor state ────────────────────────────────────────────────
  const [arAdim, setArAdim]                     = useState(0);
  const [arOkulAdi, setArOkulAdi]               = useState('');
  const [arEgitimYili]                          = useState(egitimYiliHesapla());
  const [arAy, setArAy]                         = useState('');
  const [arRaporNo, setArRaporNo]               = useState(0);
  const [arRaporTarihi, setArRaporTarihi]       = useState(bugunTarih());
  const [arCalismalar, setArCalismalar]         = useState<string[]>([]);
  const [arToplumHizmeti, setArToplumHizmeti]   = useState('');
  const [arDanisman, setArDanisman]             = useState('');
  const [arYukleniyor, setArYukleniyor]         = useState(false);

  // ─── Kulüp state ──────────────────────────────────────────────────────
  const [kAdim, setKAdim]                       = useState(0);
  const [kOkulAdi, setKOkulAdi]                 = useState('');
  const [kKurulBaskani, setKKurulBaskani]       = useState('');
  const [kDanismanOgretmen, setKDanismanOgretmen] = useState('');
  const [kOgrenciTemsilcisi, setKOgrenciTemsilcisi] = useState('');
  const [kMudur, setKMudur]                     = useState('');
  const [kTarih, setKTarih]                     = useState(bugunTarih());
  const [kEtkinlikler, setKEtkinlikler]         = useState<KulupEtkinlikSatiri[]>(() => {
    const onerilen = kulupVarsayilanEtkinlikleri(sablonAdi);
    return onerilen.length > 0 ? onerilen : [bosEtkinlikSatiri(1)];
  });
  const [kYukleniyor, setKYukleniyor]           = useState(false);

  // ─── Toplum Hizmeti state ─────────────────────────────────────────────
  const [thAdim, setThAdim]                     = useState(0);
  const [thOkulAdi, setThOkulAdi]               = useState('');
  const [thDanisman, setThDanisman]             = useState('');
  const [thMudur, setThMudur]                   = useState('');
  const [thTarih, setThTarih]                   = useState(bugunTarih());
  const [thSatirlar, setThSatirlar]             = useState<ToplumHizmetSatiri[]>(() => {
    const onerilen = kulupVarsayilanToplumHizmetSatirlari(sablonAdi);
    return onerilen.length > 0 ? onerilen : [bosToplumHizmetSatiri(1)];
  });
  const [thYukleniyor, setThYukleniyor]         = useState(false);

  useEffect(() => {
    if (isSok) {
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
        if (ogretmenlerJson) setOgretmenler(JSON.parse(ogretmenlerJson));
        else setOgretmenler(varsayilanListeOlustur(savedTipi));
      });
    } else if (isZumre) {
      Promise.all([
        AsyncStorage.getItem(STORAGE_OKUL),
        AsyncStorage.getItem(STORAGE_KULLANICI_ADI),
        AsyncStorage.getItem(STORAGE_ZUMRE_BRANS),
        AsyncStorage.getItem(STORAGE_ZUMRE_MUDUR),
        AsyncStorage.getItem(STORAGE_ZUMRE_MUDUR_YARD),
        AsyncStorage.getItem(STORAGE_ZUMRE_OGRETMENLER),
      ]).then(([okul, kulAdi, brans, mudur, mudurYard, ogretmenlerJson]) => {
        if (okul)    setZOkulAdi(okul);
        if (kulAdi)  setZBaskan(kulAdi);
        if (brans)   setZBrans(brans);
        if (mudur)   setZMudur(mudur);
        if (mudurYard) setZMudurYard(mudurYard);
        if (ogretmenlerJson) setZOgretmenler(JSON.parse(ogretmenlerJson));
      });
    } else if (isVeli) {
      Promise.all([
        AsyncStorage.getItem(STORAGE_OKUL),
        AsyncStorage.getItem(STORAGE_SINIF),
        AsyncStorage.getItem(STORAGE_KULLANICI_ADI),
        AsyncStorage.getItem(STORAGE_ZUMRE_MUDUR),
        AsyncStorage.getItem(STORAGE_ZUMRE_MUDUR_YARD),
        AsyncStorage.getItem(STORAGE_VELI_OGRETMENLER),
      ]).then(([okul, sinifKayitli, kulAdi, mudur, mudurYard, ogretmenlerJson]) => {
        if (okul)          setVOkulAdi(okul);
        if (sinifKayitli)  setVSinif(sinifKayitli);
        if (kulAdi)        setVRehber(kulAdi);
        if (mudur)         setVMudur(mudur);
        if (mudurYard)     setVMudurYard(mudurYard);
        if (ogretmenlerJson) setVOgretmenler(JSON.parse(ogretmenlerJson));
      });
    } else if (isKulup) {
      Promise.all([
        AsyncStorage.getItem(STORAGE_OKUL),
        AsyncStorage.getItem(STORAGE_KULLANICI_ADI),
        AsyncStorage.getItem(STORAGE_ZUMRE_MUDUR),
      ]).then(([okul, danisman, mudur]) => {
        if (okul)     setKOkulAdi(okul);
        if (danisman) setKDanismanOgretmen(danisman);
        if (mudur)    { setKMudur(mudur); setKKurulBaskani(mudur); }
      });
    } else if (isAylikRapor) {
      Promise.all([
        AsyncStorage.getItem(STORAGE_OKUL),
        AsyncStorage.getItem(STORAGE_KULLANICI_ADI),
      ]).then(([okul, danisman]) => {
        if (okul)     setArOkulAdi(okul);
        if (danisman) setArDanisman(danisman);
      });
    } else if (isToplumHizmet) {
      Promise.all([
        AsyncStorage.getItem(STORAGE_OKUL),
        AsyncStorage.getItem(STORAGE_KULLANICI_ADI),
        AsyncStorage.getItem(STORAGE_ZUMRE_MUDUR),
      ]).then(([okul, danisman, mudur]) => {
        if (okul)     setThOkulAdi(okul);
        if (danisman) setThDanisman(danisman);
        if (mudur)    setThMudur(mudur);
      });
    }
  }, []);

  if (!isSok && !isZumre && !isVeli && !isKulup && !isAylikRapor && !isToplumHizmet) {
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

  // ─── Veli akışı ───────────────────────────────────────────────────────
  if (isVeli) {
    const V_ADIMLAR = ['Temel Bilgiler', 'Katılımcılar', 'Gündem Notları'];

    const vIleri = () => {
      if (vAdim === 0 && (!vOkulAdi.trim() || !vSinif.trim() || !vRehber.trim())) {
        Alert.alert('Eksik bilgi', 'Okul adı, sınıf ve adınız zorunlu.');
        return;
      }
      if (vAdim < V_ADIMLAR.length - 1) setVAdim(vAdim + 1);
      else vOlustur();
    };
    const vGeri = () => setVAdim(vAdim - 1);

    async function vOlustur() {
      setVYukleniyor(true);
      try {
        await AsyncStorage.setItem(STORAGE_OKUL, vOkulAdi);
        await AsyncStorage.setItem(STORAGE_SINIF, vSinif);
        await AsyncStorage.setItem(STORAGE_KULLANICI_ADI, vRehber);
        await AsyncStorage.setItem(STORAGE_ZUMRE_MUDUR, vMudur);
        await AsyncStorage.setItem(STORAGE_ZUMRE_MUDUR_YARD, vMudurYard);
        await AsyncStorage.setItem(STORAGE_VELI_OGRETMENLER, JSON.stringify(vOgretmenler));

        const formData: VeliFormData = {
          okulAdi: vOkulAdi,
          sinif: vSinif,
          donem: vDonem,
          egitimYili: egitimYiliHesapla(),
          tarih: vTarih,
          saat: vSaat,
          rehber: vRehber,
          mudur: vMudur,
          mudurYardimcisi: vMudurYard,
          ogretmenler: vOgretmenler,
          gundemNotlari: vNotlar,
        };

        const html    = veliHtmlOlustur(formData);
        const { uri } = await Print.printToFileAsync({
          html, base64: false,
          margins: { top: 98, right: 118, bottom: 98, left: 118 },
        });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Veli Toplantısı — ${vSinif}`,
          UTI: 'com.adobe.pdf',
        });
      } catch (e) {
        Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
      } finally {
        setVYukleniyor(false);
      }
    }

    return (
      <Screen bg={colors.surface}>
        <AppBar title="Veli Toplantısı Tutanağı" back />

        <View style={s.stepper}>
          {V_ADIMLAR.map((a, i) => (
            <View key={i} style={s.stepItem}>
              <View style={[s.stepDot, i <= vAdim && s.stepDotActive]}>
                <Text style={[s.stepNo, i <= vAdim && s.stepNoActive]}>{i + 1}</Text>
              </View>
              <Text style={[s.stepLabel, i === vAdim && s.stepLabelActive]}>{a}</Text>
            </View>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {vAdim === 0 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Temel Bilgiler</Text>
              <Text style={s.adimAlt}>Toplantı başlık bilgileri</Text>

              <Alan label="Okul Adı" zorunlu>
                <TextInput style={s.input} value={vOkulAdi} onChangeText={setVOkulAdi}
                  placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Sınıf" zorunlu hint="örn. 10/A, 5-B">
                <TextInput style={s.input} value={vSinif} onChangeText={setVSinif}
                  placeholder="10/A" placeholderTextColor={colors.text3} autoCapitalize="characters" />
              </Alan>
              <Alan label="Adınız Soyadınız (Rehber Öğretmen)" zorunlu>
                <TextInput style={s.input} value={vRehber} onChangeText={setVRehber}
                  placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
              </Alan>

              <Alan label="Dönem" zorunlu>
                <View style={s.chipRow}>
                  {VELI_DONEM_TIPLERI.map(d => (
                    <TouchableOpacity
                      key={d.key}
                      style={[s.chip, vDonem === d.key && s.chipActive]}
                      onPress={() => setVDonem(d.key)}
                      activeOpacity={0.7}
                    >
                      <Text style={[s.chipText, vDonem === d.key && s.chipTextActive]}>{d.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Alan>

              <Alan label="Toplantı Tarihi" zorunlu>
                <TextInput style={s.input} value={vTarih} onChangeText={setVTarih}
                  placeholder="15 Kasım 2025" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Saat" zorunlu>
                <TextInput style={s.input} value={vSaat} onChangeText={setVSaat}
                  placeholder="17:00" placeholderTextColor={colors.text3} keyboardType="numeric" />
              </Alan>

              <View style={s.infoCard}>
                <Text style={s.infoText}>
                  Eğitim yılı:{' '}
                  <Text style={s.infoVurgu}>{egitimYiliHesapla()}</Text>
                  {'\n'}PDF'te tutanak + 30 satırlık veli katılım listesi birlikte oluşturulur.
                </Text>
              </View>
            </ScrollView>
          )}

          {vAdim === 1 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Katılımcılar</Text>
              <Text style={s.adimAlt}>Toplantıya katılan okul yönetimi ve branş öğretmenleri</Text>

              <Alan label="Okul Müdürü">
                <TextInput style={s.input} value={vMudur} onChangeText={setVMudur}
                  placeholder="Ad Soyad" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Okul Müdür Yardımcısı">
                <TextInput style={s.input} value={vMudurYard} onChangeText={setVMudurYard}
                  placeholder="Ad Soyad" placeholderTextColor={colors.text3} />
              </Alan>

              <Text style={s.listBaslik}>BRANŞ ÖĞRETMENLERİ</Text>

              {vOgretmenler.map((o, i) => (
                <View key={i} style={s.ogretmenRow}>
                  <View style={{ flex: 1, gap: 6 }}>
                    <TextInput
                      style={s.input}
                      value={o.brans}
                      onChangeText={v => {
                        const next = [...vOgretmenler];
                        next[i] = { ...next[i], brans: v };
                        setVOgretmenler(next);
                      }}
                      placeholder="Branş"
                      placeholderTextColor={colors.text3}
                    />
                    <TextInput
                      style={s.input}
                      value={o.ad}
                      onChangeText={v => {
                        const next = [...vOgretmenler];
                        next[i] = { ...next[i], ad: v };
                        setVOgretmenler(next);
                      }}
                      placeholder="Ad Soyad"
                      placeholderTextColor={colors.text3}
                    />
                  </View>
                  <TouchableOpacity
                    onPress={() => setVOgretmenler(vOgretmenler.filter((_, idx) => idx !== i))}
                    style={s.deleteBtn}
                  >
                    <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={s.addBtn}
                onPress={() => setVOgretmenler([...vOgretmenler, { brans: '', ad: '' }])}
                activeOpacity={0.7}
              >
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Öğretmen Ekle</Text>
              </TouchableOpacity>

              <View style={s.infoCard}>
                <Text style={s.infoText}>Öğretmen listesi kaydedilir, bir sonraki toplantıda güncelleme yapman yeterli.</Text>
              </View>
            </ScrollView>
          )}

          {vAdim === 2 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Gündem Notları</Text>
              <Text style={s.adimAlt}>Boş bıraktığın maddeler standart metinle doldurulur</Text>

              {VELI_GUNDEM_MADDELERI.filter(m => !m.sabit).map(madde => (
                <View key={madde.no} style={s.gundemItem}>
                  <Text style={s.gundemNo}>{madde.no}. {madde.baslik}</Text>
                  <TextInput
                    style={[s.input, s.textArea]}
                    value={vNotlar[madde.no] || ''}
                    onChangeText={v => setVNotlar({ ...vNotlar, [madde.no]: v })}
                    placeholder="Toplantıda konuşulanları kısaca yaz (boş = standart metin)"
                    placeholderTextColor={colors.text3}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </KeyboardAvoidingView>

        <View style={s.altBar}>
          {vAdim > 0 ? (
            <TouchableOpacity style={s.geriBtn} onPress={vGeri} activeOpacity={0.7}>
              <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
              <Text style={s.geriBtnText}>Geri</Text>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity
            style={[s.ileriBtn, vYukleniyor && s.ileriDisabled]}
            onPress={vIleri} activeOpacity={0.8} disabled={vYukleniyor}
          >
            {vAdim === V_ADIMLAR.length - 1 ? (
              <>
                <FileDown size={18} color="#fff" strokeWidth={2} />
                <Text style={s.ileriBtnText}>{vYukleniyor ? 'Oluşturuluyor...' : 'Evrakı Oluştur'}</Text>
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

  // ─── Aylık Faaliyet Raporu akışı ─────────────────────────────────────────
  if (isAylikRapor) {
    const AR_ADIMLAR = ['Ay & Bilgiler', 'Yapılan Çalışmalar'];

    function arAySecilince(ay: string, no: number) {
      setArAy(ay);
      setArRaporNo(no);
      const etkinlikler = kulupVarsayilanEtkinlikleri(sablonAdi);
      const satir = etkinlikler.find(e => e.tarih === ay);
      if (satir) {
        setArCalismalar(planEtkinlikleriniRaporaCevir(satir.etkinlikler));
      } else {
        setArCalismalar(['']);
      }
    }

    const arIleri = () => {
      if (arAdim === 0) {
        if (!arOkulAdi.trim() || !arDanisman.trim()) {
          Alert.alert('Eksik bilgi', 'Okul adı ve danışman öğretmen adı zorunlu.');
          return;
        }
        if (!arAy) {
          Alert.alert('Eksik bilgi', 'Faaliyet ayı seçilmeli.');
          return;
        }
      }
      if (arAdim === 1) {
        if (arCalismalar.filter(s => s.trim()).length === 0) {
          Alert.alert('Eksik bilgi', 'En az bir yapılan çalışma girilmeli.');
          return;
        }
        arOlustur();
        return;
      }
      setArAdim(arAdim + 1);
    };
    const arGeri = () => setArAdim(arAdim - 1);

    async function arOlustur() {
      setArYukleniyor(true);
      try {
        await AsyncStorage.setItem(STORAGE_OKUL, arOkulAdi);
        await AsyncStorage.setItem(STORAGE_KULLANICI_ADI, arDanisman);

        const formData: AylikRaporFormData = {
          okulAdi: arOkulAdi,
          kulupAdi: sablonAdi,
          egitimYili: arEgitimYili,
          raporNo: arRaporNo,
          faaliyetAyi: arAy,
          raporTarihi: arRaporTarihi,
          calismalar: arCalismalar.filter(s => s.trim()),
          toplumHizmeti: arToplumHizmeti,
          danismanOgretmen: arDanisman,
        };

        const html    = aylikRaporHtmlOlustur(formData);
        const { uri } = await Print.printToFileAsync({ html, base64: false });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Aylık Faaliyet Raporu — ${sablonAdi} ${arAy}`,
          UTI: 'com.adobe.pdf',
        });
      } catch {
        Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
      } finally {
        setArYukleniyor(false);
      }
    }

    return (
      <Screen bg={colors.surface}>
        <AppBar title={`${sablonAdi} — Aylık Rapor`} back />

        <View style={s.stepper}>
          {AR_ADIMLAR.map((a, i) => (
            <View key={i} style={s.stepItem}>
              <View style={[s.stepDot, i <= arAdim && s.stepDotActive]}>
                <Text style={[s.stepNo, i <= arAdim && s.stepNoActive]}>{i + 1}</Text>
              </View>
              <Text style={[s.stepLabel, i === arAdim && s.stepLabelActive]}>{a}</Text>
            </View>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {arAdim === 0 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Ay & Bilgiler</Text>
              <Text style={s.adimAlt}>{sablonAdi} — {arEgitimYili}</Text>

              <Alan label="Okul Adı" zorunlu>
                <TextInput style={s.input} value={arOkulAdi} onChangeText={setArOkulAdi}
                  placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Danışman Öğretmen" zorunlu>
                <TextInput style={s.input} value={arDanisman} onChangeText={setArDanisman}
                  placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
              </Alan>

              <Alan label="Faaliyet Ayı" zorunlu>
                <View style={s.chipRow}>
                  {RAPOR_AYLARI.map(({ ad, no }) => (
                    <TouchableOpacity
                      key={ad}
                      style={[s.chip, arAy === ad && s.chipActive]}
                      onPress={() => arAySecilince(ad, no)}
                      activeOpacity={0.7}
                    >
                      <Text style={[s.chipText, arAy === ad && s.chipTextActive]}>{ad}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Alan>

              <Alan label="Rapor Tarihi" zorunlu>
                <TextInput style={s.input} value={arRaporTarihi} onChangeText={setArRaporTarihi}
                  placeholder="28 Kasım 2025" placeholderTextColor={colors.text3} />
              </Alan>

              {arAy !== '' && (
                <View style={s.infoCard}>
                  <Text style={s.infoText}>
                    Rapor No: <Text style={s.infoVurgu}>{arRaporNo}</Text>
                    {' '}· Yıllık plandan {arCalismalar.length} etkinlik aktarıldı. Sonraki adımda düzenleyebilirsin.
                  </Text>
                </View>
              )}
            </ScrollView>
          )}

          {arAdim === 1 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Yapılan Çalışmalar</Text>
              <Text style={s.adimAlt}>
                {arAy} ayı yıllık plandan otomatik dolduruldu — her maddeyi düzenleyebilirsin
              </Text>

              {arCalismalar.map((calisma, i) => (
                <View key={i} style={s.soruCard}>
                  <View style={s.soruHeader}>
                    <Text style={s.soruNo}>{i + 1}. Çalışma</Text>
                    {arCalismalar.length > 1 && (
                      <TouchableOpacity
                        onPress={() => setArCalismalar(arCalismalar.filter((_, idx) => idx !== i))}
                        style={s.deleteBtn}
                        activeOpacity={0.7}
                      >
                        <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TextInput
                    style={[s.input, s.textArea]}
                    value={calisma}
                    onChangeText={v => setArCalismalar(arCalismalar.map((x, idx) => idx === i ? v : x))}
                    placeholder="Etkinlik başlığı gerçekleştirildi."
                    placeholderTextColor={colors.text3}
                    multiline
                  />
                </View>
              ))}

              <TouchableOpacity
                style={s.addBtn}
                onPress={() => setArCalismalar([...arCalismalar, ''])}
                activeOpacity={0.7}
              >
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Çalışma Ekle</Text>
              </TouchableOpacity>

              <Alan label="Toplum Hizmeti Çalışması">
                <TextInput
                  style={[s.input, s.textArea]}
                  value={arToplumHizmeti}
                  onChangeText={setArToplumHizmeti}
                  placeholder="Okulun ve çevresinin güzelleştirilmesi yönünde çalışmalar yapıldı."
                  placeholderTextColor={colors.text3}
                  multiline
                />
              </Alan>
            </ScrollView>
          )}
        </KeyboardAvoidingView>

        <View style={s.altBar}>
          {arAdim > 0 ? (
            <TouchableOpacity style={s.geriBtn} onPress={arGeri} activeOpacity={0.7}>
              <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
              <Text style={s.geriBtnText}>Geri</Text>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity
            style={[s.ileriBtn, arYukleniyor && s.ileriDisabled]}
            onPress={arIleri} activeOpacity={0.8} disabled={arYukleniyor}
          >
            {arAdim === AR_ADIMLAR.length - 1 ? (
              <>
                <FileDown size={18} color="#fff" strokeWidth={2} />
                <Text style={s.ileriBtnText}>{arYukleniyor ? 'Oluşturuluyor...' : 'Raporu Oluştur'}</Text>
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

  // ─── Kulüp akışı (EK-7/b — Öğrenci Kulübü Sosyal Etkinlikler Yıllık Çalışma Planı) ──
  if (isKulup) {
    const K_ADIMLAR = ['Temel Bilgiler', 'Etkinlik Planı'];

    const kIleri = () => {
      if (kAdim === 0 && (!kOkulAdi.trim() || !kDanismanOgretmen.trim())) {
        Alert.alert('Eksik bilgi', 'Okul adı ve danışman öğretmen adı zorunlu.');
        return;
      }
      if (kAdim === 1 && kEtkinlikler.every(e => !e.tarih.trim() && !e.amac.trim() && !e.etkinlikler.trim())) {
        Alert.alert('Eksik bilgi', 'En az bir etkinlik satırı doldurulmalı.');
        return;
      }
      if (kAdim < K_ADIMLAR.length - 1) setKAdim(kAdim + 1);
      else kOlustur();
    };
    const kGeri = () => setKAdim(kAdim - 1);

    async function kOlustur() {
      setKYukleniyor(true);
      try {
        await AsyncStorage.setItem(STORAGE_OKUL, kOkulAdi);
        await AsyncStorage.setItem(STORAGE_KULLANICI_ADI, kDanismanOgretmen);
        await AsyncStorage.setItem(STORAGE_ZUMRE_MUDUR, kMudur);

        const formData: KulupFormData = {
          okulAdi: kOkulAdi,
          kulupAdi: sablonAdi,
          egitimYili: egitimYiliHesapla(),
          kurulBaskani: kKurulBaskani,
          danismanOgretmen: kDanismanOgretmen,
          ogrenciTemsilcisi: kOgrenciTemsilcisi,
          mudur: kMudur,
          tarih: kTarih,
          etkinlikler: kEtkinlikler.filter(e => e.tarih.trim() || e.amac.trim() || e.etkinlikler.trim()),
        };

        const html    = kulupYillikPlanHtmlOlustur(formData);
        const { uri } = await Print.printToFileAsync({
          html, base64: false,
          margins: { top: 98, right: 118, bottom: 98, left: 118 },
        });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Kulüp Yıllık Çalışma Planı — ${sablonAdi}`,
          UTI: 'com.adobe.pdf',
        });
      } catch (e) {
        Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
      } finally {
        setKYukleniyor(false);
      }
    }

    return (
      <Screen bg={colors.surface}>
        <AppBar title={sablonAdi} back />

        <View style={s.stepper}>
          {K_ADIMLAR.map((a, i) => (
            <View key={i} style={s.stepItem}>
              <View style={[s.stepDot, i <= kAdim && s.stepDotActive]}>
                <Text style={[s.stepNo, i <= kAdim && s.stepNoActive]}>{i + 1}</Text>
              </View>
              <Text style={[s.stepLabel, i === kAdim && s.stepLabelActive]}>{a}</Text>
            </View>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {kAdim === 0 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Temel Bilgiler</Text>
              <Text style={s.adimAlt}>EK-7/b resmi formatı — {sablonAdi}</Text>

              <Alan label="Okul Adı" zorunlu>
                <TextInput style={s.input} value={kOkulAdi} onChangeText={setKOkulAdi}
                  placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Sosyal Etkinlikler Kurul Başkanı" hint="Genellikle okul müdürü veya görevlendirdiği müdür yardımcısı">
                <TextInput style={s.input} value={kKurulBaskani} onChangeText={setKKurulBaskani}
                  placeholder="Ad Soyad" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Danışman Öğretmen" zorunlu>
                <TextInput style={s.input} value={kDanismanOgretmen} onChangeText={setKDanismanOgretmen}
                  placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Öğrenci Kulübü Temsilcisi">
                <TextInput style={s.input} value={kOgrenciTemsilcisi} onChangeText={setKOgrenciTemsilcisi}
                  placeholder="Ad Soyad" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Eğitim Kurumu Müdürü">
                <TextInput style={s.input} value={kMudur} onChangeText={setKMudur}
                  placeholder="Ad Soyad" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Onay Tarihi" zorunlu>
                <TextInput style={s.input} value={kTarih} onChangeText={setKTarih}
                  placeholder="15 Eylül 2025" placeholderTextColor={colors.text3} />
              </Alan>

              <View style={s.infoCard}>
                <Text style={s.infoText}>
                  Eğitim yılı: <Text style={s.infoVurgu}>{egitimYiliHesapla()}</Text>
                  {'\n'}Bu belge, MEB Eğitim Kurumları Sosyal Etkinlikler Yönetmeliği EK-7/b formuna göre üretilir.
                </Text>
              </View>
            </ScrollView>
          )}

          {kAdim === 1 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Etkinlik Planı</Text>
              <Text style={s.adimAlt}>
                {kulupVarsayilanEtkinlikleri(sablonAdi).length > 0
                  ? `${sablonAdi} için önerilen plan hazır — dilediğin satırı düzenle, sil veya yenisini ekle`
                  : 'Yıl boyunca yapılacak etkinlikleri tarih sırasıyla ekle'}
              </Text>

              {kEtkinlikler.map((e, i) => (
                <View key={e.no} style={s.soruCard}>
                  <View style={s.soruHeader}>
                    <Text style={s.soruNo}>{i + 1}. Etkinlik</Text>
                    {kEtkinlikler.length > 1 && (
                      <TouchableOpacity
                        onPress={() => setKEtkinlikler(kEtkinlikler.filter((_, idx) => idx !== i))}
                        style={s.deleteBtn}
                      >
                        <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Alan label="Tarih" hint="örn. Ekim 2025, 29 Ekim 2025">
                    <TextInput
                      style={s.input}
                      value={e.tarih}
                      onChangeText={v => setKEtkinlikler(kEtkinlikler.map((x, idx) => idx === i ? { ...x, tarih: v } : x))}
                      placeholder="Ekim 2025"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Amaç">
                    <TextInput
                      style={[s.input, s.textArea]}
                      value={e.amac}
                      onChangeText={v => setKEtkinlikler(kEtkinlikler.map((x, idx) => idx === i ? { ...x, amac: v } : x))}
                      placeholder="Öğrencilerde gönüllülük bilincini geliştirmek"
                      placeholderTextColor={colors.text3}
                      multiline
                    />
                  </Alan>
                  <Alan label="Yapılacak Etkinlikler">
                    <TextInput
                      style={[s.input, s.textArea]}
                      value={e.etkinlikler}
                      onChangeText={v => setKEtkinlikler(kEtkinlikler.map((x, idx) => idx === i ? { ...x, etkinlikler: v } : x))}
                      placeholder="Kızılay Haftası kapsamında bağış standı kurulması"
                      placeholderTextColor={colors.text3}
                      multiline
                    />
                  </Alan>
                </View>
              ))}

              <TouchableOpacity
                style={s.addBtn}
                onPress={() => setKEtkinlikler([...kEtkinlikler, bosEtkinlikSatiri(kEtkinlikler.length + 1)])}
                activeOpacity={0.7}
              >
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Etkinlik Ekle</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </KeyboardAvoidingView>

        <View style={s.altBar}>
          {kAdim > 0 ? (
            <TouchableOpacity style={s.geriBtn} onPress={kGeri} activeOpacity={0.7}>
              <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
              <Text style={s.geriBtnText}>Geri</Text>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity
            style={[s.ileriBtn, kYukleniyor && s.ileriDisabled]}
            onPress={kIleri} activeOpacity={0.8} disabled={kYukleniyor}
          >
            {kAdim === K_ADIMLAR.length - 1 ? (
              <>
                <FileDown size={18} color="#fff" strokeWidth={2} />
                <Text style={s.ileriBtnText}>{kYukleniyor ? 'Oluşturuluyor...' : 'Evrakı Oluştur'}</Text>
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

  // ─── Toplum Hizmeti Çalışma Planı akışı ───────────────────────────────
  if (isToplumHizmet) {
    const TH_ADIMLAR = ['Temel Bilgiler', 'Çalışma Planı'];

    const thIleri = () => {
      if (thAdim === 0 && (!thOkulAdi.trim() || !thDanisman.trim())) {
        Alert.alert('Eksik bilgi', 'Okul adı ve danışman öğretmen adı zorunlu.');
        return;
      }
      if (thAdim === 1 && thSatirlar.every(s => !s.ay.trim() && !s.konular.trim())) {
        Alert.alert('Eksik bilgi', 'En az bir satır doldurulmalı.');
        return;
      }
      if (thAdim < TH_ADIMLAR.length - 1) setThAdim(thAdim + 1);
      else thOlustur();
    };
    const thGeri = () => setThAdim(thAdim - 1);

    async function thOlustur() {
      setThYukleniyor(true);
      try {
        await AsyncStorage.setItem(STORAGE_OKUL, thOkulAdi);
        await AsyncStorage.setItem(STORAGE_KULLANICI_ADI, thDanisman);
        await AsyncStorage.setItem(STORAGE_ZUMRE_MUDUR, thMudur);

        const formData: ToplumHizmetFormData = {
          okulAdi: thOkulAdi,
          kulupAdi: sablonAdi,
          egitimYili: egitimYiliHesapla(),
          danismanOgretmenler: thDanisman,
          mudur: thMudur,
          tarih: thTarih,
          satirlar: thSatirlar.filter(s => s.ay.trim() || s.konular.trim()),
        };

        const html    = toplumHizmetHtmlOlustur(formData);
        const { uri } = await Print.printToFileAsync({
          html, base64: false,
          margins: { top: 98, right: 118, bottom: 98, left: 118 },
        });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Toplum Hizmeti Çalışma Planı — ${sablonAdi}`,
          UTI: 'com.adobe.pdf',
        });
      } catch (e) {
        Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
      } finally {
        setThYukleniyor(false);
      }
    }

    return (
      <Screen bg={colors.surface}>
        <AppBar title={sablonAdi} back />

        <View style={s.stepper}>
          {TH_ADIMLAR.map((a, i) => (
            <View key={i} style={s.stepItem}>
              <View style={[s.stepDot, i <= thAdim && s.stepDotActive]}>
                <Text style={[s.stepNo, i <= thAdim && s.stepNoActive]}>{i + 1}</Text>
              </View>
              <Text style={[s.stepLabel, i === thAdim && s.stepLabelActive]}>{a}</Text>
            </View>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {thAdim === 0 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Temel Bilgiler</Text>
              <Text style={s.adimAlt}>{sablonAdi} — Toplum Hizmeti Çalışma Planı</Text>

              <Alan label="Okul Adı" zorunlu>
                <TextInput style={s.input} value={thOkulAdi} onChangeText={setThOkulAdi}
                  placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Danışman Öğretmen(ler)" zorunlu hint="Birden fazla danışman varsa her birini ayrı satıra yaz">
                <TextInput style={[s.input, s.textArea]} value={thDanisman} onChangeText={setThDanisman}
                  placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} multiline />
              </Alan>
              <Alan label="Okul Müdürü">
                <TextInput style={s.input} value={thMudur} onChangeText={setThMudur}
                  placeholder="Ad Soyad" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Onay Tarihi" zorunlu>
                <TextInput style={s.input} value={thTarih} onChangeText={setThTarih}
                  placeholder="15 Eylül 2025" placeholderTextColor={colors.text3} />
              </Alan>

              <View style={s.infoCard}>
                <Text style={s.infoText}>
                  Eğitim yılı: <Text style={s.infoVurgu}>{egitimYiliHesapla()}</Text>
                  {'\n'}Yıl boyunca yapılacak toplum hizmeti çalışmalarının aylık planı üretilir.
                </Text>
              </View>
            </ScrollView>
          )}

          {thAdim === 1 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Çalışma Planı</Text>
              <Text style={s.adimAlt}>
                {kulupVarsayilanToplumHizmetSatirlari(sablonAdi).length > 0
                  ? `${sablonAdi} için önerilen plan hazır — dilediğin satırı düzenle, sil veya yenisini ekle`
                  : 'Yıl boyunca yapılacak toplum hizmeti çalışmalarını ay sırasıyla ekle'}
              </Text>

              {thSatirlar.map((s2, i) => (
                <View key={s2.no} style={s.soruCard}>
                  <View style={s.soruHeader}>
                    <Text style={s.soruNo}>{i + 1}. Satır</Text>
                    {thSatirlar.length > 1 && (
                      <TouchableOpacity
                        onPress={() => setThSatirlar(thSatirlar.filter((_, idx) => idx !== i))}
                        style={s.deleteBtn}
                      >
                        <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Alan label="Ay" hint="örn. EKİM">
                    <TextInput
                      style={s.input}
                      value={s2.ay}
                      onChangeText={v => setThSatirlar(thSatirlar.map((x, idx) => idx === i ? { ...x, ay: v } : x))}
                      placeholder="EKİM"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Hafta">
                    <TextInput
                      style={s.input}
                      value={s2.hafta}
                      onChangeText={v => setThSatirlar(thSatirlar.map((x, idx) => idx === i ? { ...x, hafta: v } : x))}
                      placeholder="3. Hafta"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Süre">
                    <TextInput
                      style={s.input}
                      value={s2.sure}
                      onChangeText={v => setThSatirlar(thSatirlar.map((x, idx) => idx === i ? { ...x, sure: v } : x))}
                      placeholder="1 Ders Saati"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Konular ve Etkinlikler">
                    <TextInput
                      style={[s.input, s.textArea]}
                      value={s2.konular}
                      onChangeText={v => setThSatirlar(thSatirlar.map((x, idx) => idx === i ? { ...x, konular: v } : x))}
                      placeholder="Toplum hizmetinin önemini anlatmak"
                      placeholderTextColor={colors.text3}
                      multiline
                    />
                  </Alan>
                  <Alan label="Katılanlar">
                    <TextInput
                      style={s.input}
                      value={s2.katilanlar}
                      onChangeText={v => setThSatirlar(thSatirlar.map((x, idx) => idx === i ? { ...x, katilanlar: v } : x))}
                      placeholder="Kulüp öğrencileri ve Danışman öğretmen"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Düşünce-Değerlendirme" hint="Çalışma gerçekleştikten sonra doldurulur">
                    <TextInput
                      style={[s.input, s.textArea]}
                      value={s2.degerlendirme}
                      onChangeText={v => setThSatirlar(thSatirlar.map((x, idx) => idx === i ? { ...x, degerlendirme: v } : x))}
                      placeholder=""
                      placeholderTextColor={colors.text3}
                      multiline
                    />
                  </Alan>
                </View>
              ))}

              <TouchableOpacity
                style={s.addBtn}
                onPress={() => setThSatirlar([...thSatirlar, bosToplumHizmetSatiri(thSatirlar.length + 1)])}
                activeOpacity={0.7}
              >
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Satır Ekle</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </KeyboardAvoidingView>

        <View style={s.altBar}>
          {thAdim > 0 ? (
            <TouchableOpacity style={s.geriBtn} onPress={thGeri} activeOpacity={0.7}>
              <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
              <Text style={s.geriBtnText}>Geri</Text>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity
            style={[s.ileriBtn, thYukleniyor && s.ileriDisabled]}
            onPress={thIleri} activeOpacity={0.8} disabled={thYukleniyor}
          >
            {thAdim === TH_ADIMLAR.length - 1 ? (
              <>
                <FileDown size={18} color="#fff" strokeWidth={2} />
                <Text style={s.ileriBtnText}>{thYukleniyor ? 'Oluşturuluyor...' : 'Evrakı Oluştur'}</Text>
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

  // ─── Zümre akışı ──────────────────────────────────────────────────────
  if (isZumre) {
    const Z_ADIMLAR = ['Temel Bilgiler', 'Katılımcılar', 'Gündem Notları'];

    const zIleri = () => {
      if (zAdim === 0 && (!zOkulAdi.trim() || !zBrans.trim() || !zBaskan.trim())) {
        Alert.alert('Eksik bilgi', 'Okul adı, branş ve adınız zorunlu.');
        return;
      }
      if (zAdim < Z_ADIMLAR.length - 1) setZAdim(zAdim + 1);
      else zOlustur();
    };
    const zGeri = () => setZAdim(zAdim - 1);

    async function zOlustur() {
      setZYukleniyor(true);
      try {
        await AsyncStorage.setItem(STORAGE_OKUL, zOkulAdi);
        await AsyncStorage.setItem(STORAGE_KULLANICI_ADI, zBaskan);
        await AsyncStorage.setItem(STORAGE_ZUMRE_BRANS, zBrans);
        await AsyncStorage.setItem(STORAGE_ZUMRE_MUDUR, zMudur);
        await AsyncStorage.setItem(STORAGE_ZUMRE_MUDUR_YARD, zMudurYard);
        await AsyncStorage.setItem(STORAGE_ZUMRE_OGRETMENLER, JSON.stringify(zOgretmenler));

        const formData: ZumreFormData = {
          okulAdi: zOkulAdi,
          brans: zBrans,
          topTipi: zTipi,
          egitimYili: egitimYiliHesapla(),
          tarih: zTarih,
          saat: zSaat,
          zumreBaskani: zBaskan,
          mudur: zMudur,
          mudurYardimcisi: zMudurYard,
          ogretmenler: zOgretmenler,
          gundemNotlari: zNotlar,
        };

        const html    = zumreHtmlOlustur(formData);
        const { uri } = await Print.printToFileAsync({
          html, base64: false,
          margins: { top: 98, right: 118, bottom: 98, left: 118 },
        });
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: `Zümre Tutanağı — ${zBrans}`,
          UTI: 'com.adobe.pdf',
        });
      } catch (e) {
        Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
      } finally {
        setZYukleniyor(false);
      }
    }

    return (
      <Screen bg={colors.surface}>
        <AppBar title="Zümre Tutanağı" back />

        <View style={s.stepper}>
          {Z_ADIMLAR.map((a, i) => (
            <View key={i} style={s.stepItem}>
              <View style={[s.stepDot, i <= zAdim && s.stepDotActive]}>
                <Text style={[s.stepNo, i <= zAdim && s.stepNoActive]}>{i + 1}</Text>
              </View>
              <Text style={[s.stepLabel, i === zAdim && s.stepLabelActive]}>{a}</Text>
            </View>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {zAdim === 0 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Temel Bilgiler</Text>
              <Text style={s.adimAlt}>Tutanak başlık bilgileri</Text>

              <Alan label="Okul Adı" zorunlu>
                <TextInput style={s.input} value={zOkulAdi} onChangeText={setZOkulAdi}
                  placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Branş" zorunlu hint="Zümrenizin branş adı">
                <TextInput style={s.input} value={zBrans} onChangeText={setZBrans}
                  placeholder="Matematik" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Adınız Soyadınız (Zümre Başkanı)" zorunlu>
                <TextInput style={s.input} value={zBaskan} onChangeText={setZBaskan}
                  placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
              </Alan>

              <Alan label="Toplantı Türü" zorunlu>
                <View style={s.chipRow}>
                  {TOPLANTI_TIPLERI.map(t => (
                    <TouchableOpacity
                      key={t.key}
                      style={[s.chip, zTipi === t.key && s.chipActive]}
                      onPress={() => setZTipi(t.key)}
                      activeOpacity={0.7}
                    >
                      <Text style={[s.chipText, zTipi === t.key && s.chipTextActive]}>{t.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Alan>

              <Alan label="Toplantı Tarihi" zorunlu>
                <TextInput style={s.input} value={zTarih} onChangeText={setZTarih}
                  placeholder="15 Kasım 2025" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Saat" zorunlu>
                <TextInput style={s.input} value={zSaat} onChangeText={setZSaat}
                  placeholder="14:30" placeholderTextColor={colors.text3} keyboardType="numeric" />
              </Alan>

              <View style={s.infoCard}>
                <Text style={s.infoText}>
                  Eğitim yılı:{' '}
                  <Text style={s.infoVurgu}>{egitimYiliHesapla()}</Text>
                </Text>
              </View>
            </ScrollView>
          )}

          {zAdim === 1 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Katılımcılar</Text>
              <Text style={s.adimAlt}>Toplantıya katılan okul yönetimi ve öğretmenler</Text>

              <Alan label="Okul Müdürü">
                <TextInput style={s.input} value={zMudur} onChangeText={setZMudur}
                  placeholder="Ad Soyad" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Okul Müdür Yardımcısı">
                <TextInput style={s.input} value={zMudurYard} onChangeText={setZMudurYard}
                  placeholder="Ad Soyad" placeholderTextColor={colors.text3} />
              </Alan>

              <Text style={s.listBaslik}>{zBrans ? turkceBuyuk(zBrans) : 'BRANŞ'} ÖĞRETMENLERİ</Text>

              {zOgretmenler.map((o, i) => (
                <View key={i} style={s.ogretmenRow}>
                  <TextInput
                    style={[s.input, { flex: 1 }]}
                    value={o.ad}
                    onChangeText={v => {
                      const next = [...zOgretmenler];
                      next[i] = { ad: v };
                      setZOgretmenler(next);
                    }}
                    placeholder="Ad Soyad"
                    placeholderTextColor={colors.text3}
                  />
                  <TouchableOpacity
                    onPress={() => setZOgretmenler(zOgretmenler.filter((_, idx) => idx !== i))}
                    style={s.deleteBtn}
                  >
                    <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity
                style={s.addBtn}
                onPress={() => setZOgretmenler([...zOgretmenler, { ad: '' }])}
                activeOpacity={0.7}
              >
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Öğretmen Ekle</Text>
              </TouchableOpacity>

              <View style={s.infoCard}>
                <Text style={s.infoText}>Yönetim ve öğretmen listesi kaydedilir, bir sonraki toplantıda güncelleme yapman yeterli.</Text>
              </View>
            </ScrollView>
          )}

          {zAdim === 2 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Gündem Notları</Text>
              <Text style={s.adimAlt}>Boş bıraktığın maddeler standart metinle doldurulur</Text>

              {ZUMRE_GUNDEM_MADDELERI.filter(m => !m.sabit).map(madde => (
                <View key={madde.no} style={s.gundemItem}>
                  <Text style={s.gundemNo}>{madde.no}. {madde.baslik}</Text>
                  <TextInput
                    style={[s.input, s.textArea]}
                    value={zNotlar[madde.no] || ''}
                    onChangeText={v => setZNotlar({ ...zNotlar, [madde.no]: v })}
                    placeholder="Toplantıda konuşulanları kısaca yaz (boş = standart metin)"
                    placeholderTextColor={colors.text3}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              ))}
            </ScrollView>
          )}
        </KeyboardAvoidingView>

        <View style={s.altBar}>
          {zAdim > 0 ? (
            <TouchableOpacity style={s.geriBtn} onPress={zGeri} activeOpacity={0.7}>
              <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
              <Text style={s.geriBtnText}>Geri</Text>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity
            style={[s.ileriBtn, zYukleniyor && s.ileriDisabled]}
            onPress={zIleri} activeOpacity={0.8} disabled={zYukleniyor}
          >
            {zAdim === Z_ADIMLAR.length - 1 ? (
              <>
                <FileDown size={18} color="#fff" strokeWidth={2} />
                <Text style={s.ileriBtnText}>{zYukleniyor ? 'Oluşturuluyor...' : 'Evrakı Oluştur'}</Text>
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

  soruCard: {
    backgroundColor: colors.bg, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md, gap: spacing.sm,
  } as ViewStyle,
  soruHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' } as ViewStyle,
  soruNo: { fontSize: 14, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,

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
