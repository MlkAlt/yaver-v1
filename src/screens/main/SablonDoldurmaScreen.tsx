import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, TextInput, Alert,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { Plus, Trash2, ChevronRight, ChevronLeft, ChevronDown, FileDown, RotateCcw, Shuffle } from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import * as Print from 'expo-print';
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
import {
  KulupEtkinlikSatiri, bosEtkinlikSatiri, ToplumHizmetSatiri, bosToplumHizmetSatiri,
  OgrenciSatiri, bosOgrenciSatiri, KararSatiri, bosKararSatiri,
} from '../../data/kulupSablon';
import { kulupYillikPlanHtmlOlustur, KulupFormData } from '../../data/kulupHtmlSablon';
import { kulupVarsayilanEtkinlikleri, kulupVarsayilanToplumHizmetSatirlari } from '../../data/kulupYillikPlanlari';
import { RAPOR_AYLARI, planEtkinlikleriniRaporaCevir, aylikRaporHtmlOlustur, AylikRaporFormData } from '../../data/aylikRaporHtmlSablon';
import { toplumHizmetHtmlOlustur, ToplumHizmetFormData } from '../../data/toplumHizmetHtmlSablon';
import { aylikRehberlikHtmlOlustur, AylikRehberlikFormData } from '../../data/rehberlikHtmlSablon';
import {
  REHBERLIK_AYLARI, VeliGorusmeSatiri, OgrenciGorusmeSatiri, bosVeliGorusmeSatiri, bosOgrenciGorusmeSatiri,
  RehberlikHaftaSatiri, TestAnketSatiri, bosHaftaSatiri, bosTestAnketSatiri,
} from '../../data/rehberlikSablon';
import { donemSonuHtmlOlustur, DonemSonuFormData } from '../../data/donemSonuHtmlSablon';
import { KAZANIM_DURUMLARI, KazanimDurumu, DONEM_SECENEKLERI, FaaliyetSatiri, VeliFaaliyetSatiri, YonlendirmeSatiri, bosFaaliyetSatiri, bosVeliFaaliyetSatiri, bosYonlendirmeSatiri, varsayilanVeliFaaliyetleri } from '../../data/donemSonuSablon';
import { dilekceHtmlOlustur } from '../../data/dilekceHtmlSablon';
import { DilekceTuru, DilekceFormData, DILEKCE_SABLONLARI, getDilekceSablonu } from '../../data/dilekceSablon';
import { yillikPlanHtmlOlustur } from '../../data/rehberlikYillikPlanHtmlSablon';
import { useOnboarding } from '../../context/OnboardingContext';
import { sinifLabel } from '../../lib/sinifLabel';
import { SinifSecici } from '../../components/SinifSecici';
import { REHBERLIK_YILLIK_PLAN } from '../../data/rehberlikYillikPlanlari';
import { yoklamaKararHtmlOlustur, YoklamaKararFormData } from '../../data/yoklamaKararHtmlSablon';
import {
  PERFORMANS_SABLONLARI, PerformansOgrenciSatiri, notuKriterlereDagit,
} from '../../data/performansSablon';
import { performansHtmlOlustur, PerformansFormData } from '../../data/performansHtmlSablon';
import { turkceBuyuk } from '../../lib/turkce';
import { pdfOnizlemeAc } from '../../lib/pdfOnizleme';
import { rehberlikAylikKaydiOku, rehberlikAylikKaydiYaz, yillikPlandanHaftaOnerisi, donemVeriOzetiOlustur } from '../../data/rehberlikVeriZinciri';

type Props = NativeStackScreenProps<RootStackParamList, 'SablonDoldurma'>;
type OkulTipi = 'ilkokul' | 'ortaokul' | 'lise' | 'ihl';

type POgrenciUI = {
  no: number;
  okulNo: string;
  adSoyad: string;
  asilNot: string;
  puanlar: number[];
};

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
const STORAGE_PERFORMANS_LISTE_PREFIX = '@yaver/performans_liste_';

const performansRosterKey = (sinif: string) =>
  `${STORAGE_PERFORMANS_LISTE_PREFIX}${sinif.trim().toUpperCase() || '_genel'}`;

function parsePerformansSatirlari(metin: string): { okulNo: string; adSoyad: string }[] {
  return metin.split('\n').map(s => s.trim()).filter(Boolean).map(satir => {
    const m = satir.match(/^(\d+)\s+(.+)$/);
    return m ? { okulNo: m[1], adSoyad: m[2].trim() } : { okulNo: '', adSoyad: satir };
  });
}

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
      <Alan label="Sınıf" zorunlu>
        <SinifSecici value={sinif} onChange={setSinif} />
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
  const isYoklamaKarar = sablonId === 'yoklama_karar';
  const isPerformans   = sablonId === 'performans';
  const isRehberlikAylik = sablonId === 'rehberlik_aylik';
  const isDonemSonu    = sablonId === 'donem_sonu';
  const isDilekce      = sablonId === 'dilekce';
  const isYillikPlan   = sablonId === 'rehberlik_yillik';

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

  // ─── Yoklama ve Karar Defteri state ───────────────────────────────────
  const [yAdim, setYAdim]                       = useState(0);
  const [yOkulAdi, setYOkulAdi]                 = useState('');
  const [yEgitimYili]                           = useState(egitimYiliHesapla());
  const [yDanisman, setYDanisman]               = useState('');
  const [yOgrenciler, setYOgrenciler]           = useState<OgrenciSatiri[]>(
    () => Array.from({ length: 5 }, (_, i) => bosOgrenciSatiri(i + 1))
  );
  const [yKararlar, setYKararlar]               = useState<KararSatiri[]>([bosKararSatiri(1)]);
  const [yYukleniyor, setYYukleniyor]           = useState(false);

  // ─── Performans Notu state ─────────────────────────────────────────────
  const [pAdim, setPAdim]                       = useState(0);
  const [pOkulAdi, setPOkulAdi]                 = useState('');
  const [pSinif, setPSinif]                     = useState('');
  const [pDersAdi, setPDersAdi]                 = useState('');
  const [pEgitimYili]                           = useState(egitimYiliHesapla());
  const [pTarih, setPTarih]                     = useState(bugunTarih());
  const [pOgretmen, setPOgretmen]               = useState('');
  const [pMudur, setPMudur]                     = useState('');
  const [pSablonId, setPSablonId]               = useState<'birinci' | 'ikinci'>('birinci');
  const [pRoster, setPRoster]                   = useState<{ okulNo: string; adSoyad: string }[]>([]);
  const [pMod, setPMod]                         = useState<'oto' | 'manuel'>('oto');
  const [pOgrenciler, setPOgrenciler]           = useState<POgrenciUI[]>([]);
  const pNotInputRefs = useRef<Array<TextInput | null>>([]);
  const pKriterInputRefs = useRef<Array<Array<TextInput | null>>>([]);
  const [pAcikKirilim, setPAcikKirilim]         = useState<Set<number>>(new Set()); // salt-UI: dağıtım kırılımı açık öğrenci indeksleri
  const [pKriterlerAcik, setPKriterlerAcik]     = useState(false); // salt-UI: Puanlama adımında kriter referansı açık mı
  const [pYukleniyor, setPYukleniyor]           = useState(false);

  // ─── Rehberlik Aylık Rapor state ──────────────────────────────────────
  const [rbAdim, setRbAdim]                     = useState(0);
  const [rbOkulAdi, setRbOkulAdi]               = useState('');
  const [rbEgitimYili]                          = useState(egitimYiliHesapla());
  const [rbSinif, setRbSinif]                   = useState('');
  const [rbAy, setRbAy]                         = useState('');
  const [rbRaporNo, setRbRaporNo]               = useState(1);
  const [rbRaporTarihi, setRbRaporTarihi]       = useState(bugunTarih());
  const [rbSinifMevcudu, setRbSinifMevcudu]     = useState('');
  const [rbSinifOgretmeni, setRbSinifOgretmeni] = useState('');
  const [rbRehberOgretmeni, setRbRehberOgretmeni] = useState('');
  const [rbMudur, setRbMudur]                   = useState('');
  const [rbHaftalar, setRbHaftalar]             = useState<RehberlikHaftaSatiri[]>([bosHaftaSatiri(1)]);
  const [rbTestAnketler, setRbTestAnketler]     = useState<TestAnketSatiri[]>([]);
  const [rbDigerCalismalar, setRbDigerCalismalar] = useState<string[]>(['']);
  const [rbVeliGorusmeleri, setRbVeliGorusmeleri]       = useState<VeliGorusmeSatiri[]>([]);
  const [rbOgrenciGorusmeleri, setRbOgrenciGorusmeleri] = useState<OgrenciGorusmeSatiri[]>([]);
  const [rbYukleniyor, setRbYukleniyor]         = useState(false);

  // ─── Dönem Sonu Raporu state ──────────────────────────────────────────
  const [dsAdim, setDsAdim]                     = useState(0);
  const [dsOkulAdi, setDsOkulAdi]               = useState('');
  const [dsEgitimYili]                          = useState(egitimYiliHesapla());
  const [dsDonem, setDsDonem]                   = useState('donem2');
  const [dsSinif, setDsSinif]                   = useState('');
  const [dsRehber, setDsRehber]                 = useState('');
  const [dsMudur, setDsMudur]                   = useState('');
  const [dsTarih, setDsTarih]                   = useState(bugunTarih());
  const [dsKazanimDurumu, setDsKazanimDurumu]   = useState<KazanimDurumu>('evet');
  const [dsKazanimAciklama, setDsKazanimAciklama] = useState('');
  const [dsTeknikler, setDsTeknikler]           = useState('');
  const [dsFaaliyetler, setDsFaaliyetler]       = useState<FaaliyetSatiri[]>([bosFaaliyetSatiri()]);
  const [dsVeliFaaliyetler, setDsVeliFaaliyetler] = useState<VeliFaaliyetSatiri[]>(() => varsayilanVeliFaaliyetleri());
  const [dsYonlendirmeler, setDsYonlendirmeler] = useState<YonlendirmeSatiri[]>([]);
  const [dsGuclukler, setDsGuclukler]           = useState('');
  const [dsCozum, setDsCozum]                   = useState('');
  const [dsPdrIsbirligi, setDsPdrIsbirligi]     = useState('');
  const [dsPdrBeklenti, setDsPdrBeklenti]       = useState('');
  const [dsYukleniyor, setDsYukleniyor]         = useState(false);

  // ─── Dilekçe state ────────────────────────────────────────────────────
  const [dlAdim, setDlAdim]                     = useState(0);
  const [dlTuru, setDlTuru]                     = useState<DilekceTuru>('mazeret');
  const [dlOkul, setDlOkul]                     = useState('');
  const [dlMakam, setDlMakam]                   = useState(getDilekceSablonu('mazeret').makamVarsayilan);
  const [dlAdSoyad, setDlAdSoyad]               = useState('');
  const [dlGorev, setDlGorev]                   = useState('');
  const [dlTc, setDlTc]                         = useState('');
  const [dlImzaYeri, setDlImzaYeri]             = useState('');
  const [dlTarih, setDlTarih]                   = useState(bugunTarih());
  const [dlGovde, setDlGovde]                   = useState(getDilekceSablonu('mazeret').govdeKalibi);
  const [dlEkler, setDlEkler]                   = useState('');
  const [dlYukleniyor, setDlYukleniyor]         = useState(false);

  // ─── Yıllık Rehberlik Planı state ─────────────────────────────────────
  const [ypOkulAdi, setYpOkulAdi]               = useState('');
  const [ypEgitimYili]                          = useState(egitimYiliHesapla());
  const [ypSinif, setYpSinif]                   = useState(-1); // -1 = seçilmedi, 0 = okul öncesi, 1-12 = sınıf
  const [ypRehber, setYpRehber]                 = useState('');
  const [ypOkulRehber, setYpOkulRehber]          = useState('');
  const [ypMudur, setYpMudur]                   = useState('');
  const [ypYukleniyor, setYpYukleniyor]         = useState(false);

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
    } else if (isYoklamaKarar) {
      Promise.all([
        AsyncStorage.getItem(STORAGE_OKUL),
        AsyncStorage.getItem(STORAGE_KULLANICI_ADI),
      ]).then(([okul, danisman]) => {
        if (okul)     setYOkulAdi(okul);
        if (danisman) setYDanisman(danisman);
      });
    } else if (isPerformans) {
      Promise.all([
        AsyncStorage.getItem(STORAGE_OKUL),
        AsyncStorage.getItem(STORAGE_KULLANICI_ADI),
      ]).then(([okul, ogretmen]) => {
        if (okul)     setPOkulAdi(okul);
        if (ogretmen) setPOgretmen(ogretmen);
      });
    } else if (isRehberlikAylik) {
      Promise.all([
        AsyncStorage.getItem(STORAGE_OKUL),
        AsyncStorage.getItem(STORAGE_KULLANICI_ADI),
        AsyncStorage.getItem(STORAGE_ZUMRE_MUDUR),
      ]).then(([okul, ad, mudur]) => {
        if (okul) setRbOkulAdi(okul);
        if (ad)   setRbSinifOgretmeni(ad);
        if (mudur) setRbMudur(mudur);
      });
    } else if (isDonemSonu) {
      Promise.all([
        AsyncStorage.getItem(STORAGE_OKUL),
        AsyncStorage.getItem(STORAGE_KULLANICI_ADI),
        AsyncStorage.getItem(STORAGE_ZUMRE_MUDUR),
      ]).then(([okul, ad, mudur]) => {
        if (okul) setDsOkulAdi(okul);
        if (ad)   setDsRehber(ad);
        if (mudur) setDsMudur(mudur);
      });
    } else if (isDilekce) {
      Promise.all([
        AsyncStorage.getItem(STORAGE_OKUL),
        AsyncStorage.getItem(STORAGE_KULLANICI_ADI),
      ]).then(([okul, ad]) => {
        if (ad) setDlAdSoyad(ad);
        if (okul) {
          setDlOkul(okul);
          setDlMakam(m => m.replace('[OKUL ADI]', okul));
        }
      });
    } else if (isYillikPlan) {
      Promise.all([
        AsyncStorage.getItem(STORAGE_OKUL),
        AsyncStorage.getItem(STORAGE_KULLANICI_ADI),
        AsyncStorage.getItem(STORAGE_ZUMRE_MUDUR),
      ]).then(([okul, ad, mudur]) => {
        if (okul) setYpOkulAdi(okul);
        if (ad)   setYpRehber(ad);
        if (mudur) setYpMudur(mudur);
      });
    }
  }, []);

  if (!isSok && !isZumre && !isVeli && !isKulup && !isAylikRapor && !isToplumHizmet && !isYoklamaKarar && !isPerformans && !isRehberlikAylik && !isDonemSonu && !isDilekce && !isYillikPlan) {
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
        await pdfOnizlemeAc(html, false);
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
              <Alan label="Sınıf" zorunlu>
                <SinifSecici value={vSinif} onChange={setVSinif} />
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
      // kulupVarsayilanEtkinlikleri 'tarih' alanını büyük harfle ('EKİM') döndürüyor,
      // RAPOR_AYLARI ise başlık formatında ('Ekim') — Türkçe locale ile eşleştirilmeli
      // yoksa .toUpperCase() 'i'yi 'I' yapıp 'İ' ile eşleşmeyi kaçırır.
      const satir = etkinlikler.find(e => e.tarih.toLocaleUpperCase('tr-TR') === ay.toLocaleUpperCase('tr-TR'));
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
        await pdfOnizlemeAc(html, false);
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

  // ─── Yıllık Rehberlik Planı akışı (Sınıf Rehberlik Hizmetleri Yıllık Çalışma Planı) ──
  if (isYillikPlan) {
    const ypSiniflar = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const ypSinifEtiket = (n: number) => (n === 0 ? 'Okul Öncesi' : `${n}. Sınıf`);

    async function ypOlustur() {
      if (!ypOkulAdi.trim() || !ypRehber.trim()) {
        Alert.alert('Eksik bilgi', 'Okul adı ve sınıf rehber öğretmeni zorunlu.');
        return;
      }
      if (ypSinif < 0) {
        Alert.alert('Eksik bilgi', 'Sınıf seçilmeli.');
        return;
      }
      setYpYukleniyor(true);
      try {
        await AsyncStorage.setItem(STORAGE_OKUL, ypOkulAdi);
        await AsyncStorage.setItem(STORAGE_KULLANICI_ADI, ypRehber);
        if (ypMudur.trim()) await AsyncStorage.setItem(STORAGE_ZUMRE_MUDUR, ypMudur);

        const html    = yillikPlanHtmlOlustur({
          okulAdi: ypOkulAdi, egitimYili: ypEgitimYili, sinif: ypSinif,
          sinifRehberOgretmeni: ypRehber, okulRehberOgretmeni: ypOkulRehber, okulMuduru: ypMudur,
        });
        await pdfOnizlemeAc(html, true);
      } catch {
        Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
      } finally {
        setYpYukleniyor(false);
      }
    }

    return (
      <Screen bg={colors.surface}>
        <AppBar title="Yıllık Rehberlik Planı" back />
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
            <Text style={s.adimBaslik}>Sınıf Rehberlik Yıllık Planı</Text>
            <Text style={s.adimAlt}>{ypEgitimYili} · Sınıfını seç, plan hazır gelsin</Text>

            <Alan label="Okul Adı" zorunlu>
              <TextInput style={s.input} value={ypOkulAdi} onChangeText={setYpOkulAdi}
                placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
            </Alan>
            <Alan label="Sınıf" zorunlu>
              <View style={s.chipRow}>
                {ypSiniflar.map(n => (
                  <TouchableOpacity key={n} style={[s.chip, ypSinif === n && s.chipActive]}
                    onPress={() => setYpSinif(n)} activeOpacity={0.7}>
                    <Text style={[s.chipText, ypSinif === n && s.chipTextActive]}>{ypSinifEtiket(n)}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Alan>
            <Alan label="Sınıf Rehber Öğretmeni" zorunlu>
              <TextInput style={s.input} value={ypRehber} onChangeText={setYpRehber}
                placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
            </Alan>
            <Alan label="Okul Rehber Öğretmeni">
              <TextInput style={s.input} value={ypOkulRehber} onChangeText={setYpOkulRehber}
                placeholder="Rehber öğretmen adı" placeholderTextColor={colors.text3} />
            </Alan>
            <Alan label="Okul Müdürü">
              <TextInput style={s.input} value={ypMudur} onChangeText={setYpMudur}
                placeholder="Müdür adı" placeholderTextColor={colors.text3} />
            </Alan>

            {ypSinif >= 0 && (
              <View style={s.infoCard}>
                <Text style={s.infoText}>
                  {ypSinifEtiket(ypSinif)} planı hazır — <Text style={s.infoVurgu}>{(REHBERLIK_YILLIK_PLAN[ypSinif] || []).length}</Text> satırlık çalışma. "Planı Oluştur"a bas, düzenlemeden yatay PDF gelir.
                </Text>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>

        <View style={s.altBar}>
          <View />
          <TouchableOpacity style={[s.ileriBtn, ypYukleniyor && s.ileriDisabled]}
            onPress={ypOlustur} activeOpacity={0.8} disabled={ypYukleniyor}>
            <FileDown size={18} color="#fff" strokeWidth={2} />
            <Text style={s.ileriBtnText}>{ypYukleniyor ? 'Oluşturuluyor...' : 'Planı Oluştur'}</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  // ─── Dilekçe akışı (Öğretmen dilekçe bankası — 4 tür) ──
  if (isDilekce) {
    const DL_ADIMLAR = ['Tür & Kimlik', 'Gövde & Ekler'];
    const dlSablon = getDilekceSablonu(dlTuru);
    const dlTcVar = dlSablon.alanlar.includes('tc');

    function dlTurSec(turu: DilekceTuru) {
      const t = getDilekceSablonu(turu);
      setDlTuru(turu);
      setDlGovde(t.govdeKalibi);
      setDlMakam(dlOkul ? t.makamVarsayilan.replace('[OKUL ADI]', dlOkul) : t.makamVarsayilan);
    }

    const dlIleri = () => {
      if (dlAdim === 0) {
        if (!dlAdSoyad.trim() || !dlGorev.trim()) {
          Alert.alert('Eksik bilgi', 'Ad soyad ve görev/branş zorunlu.');
          return;
        }
        if (!dlMakam.trim()) {
          Alert.alert('Eksik bilgi', 'Hitap edilen makam boş olamaz.');
          return;
        }
      }
      if (dlAdim === DL_ADIMLAR.length - 1) { dlOlustur(); return; }
      setDlAdim(dlAdim + 1);
    };
    const dlGeri = () => setDlAdim(dlAdim - 1);

    async function dlOlustur() {
      setDlYukleniyor(true);
      try {
        await AsyncStorage.setItem(STORAGE_KULLANICI_ADI, dlAdSoyad);

        const formData: DilekceFormData = {
          turu: dlTuru,
          adSoyad: dlAdSoyad,
          gorev: dlGorev,
          tc: dlTcVar ? dlTc : undefined,
          tarih: dlTarih || bugunTarih(),
          makam: dlMakam,
          govde: dlGovde,
          ekler: dlEkler.split('\n').map(x => x.trim()).filter(Boolean),
          imzaYeri: dlImzaYeri,
        };

        const html    = dilekceHtmlOlustur(formData);
        await pdfOnizlemeAc(html, false);
      } catch {
        Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
      } finally {
        setDlYukleniyor(false);
      }
    }

    return (
      <Screen bg={colors.surface}>
        <AppBar title="Dilekçe" back />

        <View style={s.stepper}>
          {DL_ADIMLAR.map((a, i) => (
            <View key={i} style={s.stepItem}>
              <View style={[s.stepDot, i <= dlAdim && s.stepDotActive]}>
                <Text style={[s.stepNo, i <= dlAdim && s.stepNoActive]}>{i + 1}</Text>
              </View>
              <Text style={[s.stepLabel, i === dlAdim && s.stepLabelActive]}>{a}</Text>
            </View>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {dlAdim === 0 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Dilekçe Türü</Text>
              <Text style={s.adimAlt}>{dlSablon.aciklama}</Text>
              <View style={s.chipRow}>
                {DILEKCE_SABLONLARI.map(t => (
                  <TouchableOpacity key={t.id} style={[s.chip, dlTuru === t.id && s.chipActive]} onPress={() => dlTurSec(t.id)} activeOpacity={0.7}>
                    <Text style={[s.chipText, dlTuru === t.id && s.chipTextActive]}>{t.ad}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ height: 8 }} />
              <Alan label="Hitap Edilen Makam" zorunlu>
                <TextInput style={s.input} value={dlMakam} onChangeText={setDlMakam}
                  placeholder="… Müdürlüğüne" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Ad Soyad" zorunlu>
                <TextInput style={s.input} value={dlAdSoyad} onChangeText={setDlAdSoyad}
                  placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Görev / Branş" zorunlu>
                <TextInput style={s.input} value={dlGorev} onChangeText={setDlGorev}
                  placeholder="Matematik Öğretmeni" placeholderTextColor={colors.text3} />
              </Alan>
              {dlTcVar && (
                <Alan label="T.C. Kimlik No">
                  <TextInput style={s.input} value={dlTc} onChangeText={setDlTc}
                    placeholder="(opsiyonel)" placeholderTextColor={colors.text3} keyboardType="number-pad" />
                </Alan>
              )}
              <Alan label="Yer">
                <TextInput style={s.input} value={dlImzaYeri} onChangeText={setDlImzaYeri}
                  placeholder="Konya (opsiyonel)" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Tarih">
                <TextInput style={s.input} value={dlTarih} onChangeText={setDlTarih}
                  placeholder="04.07.2026" placeholderTextColor={colors.text3} />
              </Alan>
            </ScrollView>
          )}

          {dlAdim === 1 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Dilekçe Metni</Text>
              <Text style={s.adimAlt}>Köşeli parantezli [...] kısımları kendine göre düzenle</Text>
              <TextInput
                style={[s.input, s.textArea, { minHeight: 220, textAlignVertical: 'top' }]}
                value={dlGovde} onChangeText={setDlGovde} multiline
                placeholder="Dilekçe gövdesi" placeholderTextColor={colors.text3}
              />
              <Alan label="Ekler">
                <TextInput style={[s.input, s.textArea]} value={dlEkler} onChangeText={setDlEkler}
                  placeholder="Her satıra bir ek — opsiyonel" placeholderTextColor={colors.text3} multiline />
              </Alan>
            </ScrollView>
          )}
        </KeyboardAvoidingView>

        <View style={s.altBar}>
          {dlAdim > 0 ? (
            <TouchableOpacity style={s.geriBtn} onPress={dlGeri} activeOpacity={0.7}>
              <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
              <Text style={s.geriBtnText}>Geri</Text>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity style={[s.ileriBtn, dlYukleniyor && s.ileriDisabled]} onPress={dlIleri} activeOpacity={0.8} disabled={dlYukleniyor}>
            {dlAdim === DL_ADIMLAR.length - 1 ? (
              <>
                <FileDown size={18} color="#fff" strokeWidth={2} />
                <Text style={s.ileriBtnText}>{dlYukleniyor ? 'Oluşturuluyor...' : 'Dilekçeyi Oluştur'}</Text>
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

  // ─── Dönem Sonu Raporu akışı (Sınıf Rehberlik Hizmetleri Dönem Sonu Faaliyet Raporu) ──
  if (isDonemSonu) {
    const DS_ADIMLAR = ['Temel Bilgiler', 'Kazanımlar', 'Faaliyetler', 'Değerlendirme'];
    const dsDonemLabel = DONEM_SECENEKLERI.find(d => d.key === dsDonem)?.label ?? '';

    // Sınıf+dönem doluysa: dönemin aylarındaki Aylık Rapor kayıtlarını (yoksa yıllık plandan
    // gelen öneriyi) toplayıp Faaliyetler + Kazanımlar adımlarını otomatik doldurur. Öğretmen
    // zaten bir şey girmişse (pristine değilse) üzerine yazmaz.
    async function dsVeriyiUygula(sinifDeger: string, donemDeger: string) {
      if (!sinifDeger.trim()) return;
      const ozet = await donemVeriOzetiOlustur(sinifDeger, donemDeger);

      if (dsFaaliyetler.every(f => !f.calisma.trim())) {
        setDsFaaliyetler(ozet.faaliyetler.length
          ? ozet.faaliyetler.map(m => ({ calisma: m, kiz: '', erkek: '' }))
          : [bosFaaliyetSatiri()]);
      }
      if (dsKazanimDurumu === 'evet' && !dsKazanimAciklama.trim()) {
        if (ozet.islenmeyenKazanimlar.length === 0) {
          setDsKazanimDurumu('evet');
        } else {
          setDsKazanimDurumu(ozet.islenenKazanimSayisi > 0 ? 'kismen' : 'hayir');
          setDsKazanimAciklama(ozet.islenmeyenKazanimlar.map(k => `- ${k}`).join('\n'));
        }
      }
    }

    const dsIleri = () => {
      if (dsAdim === 0) {
        if (!dsOkulAdi.trim() || !dsSinif.trim() || !dsRehber.trim()) {
          Alert.alert('Eksik bilgi', 'Okul adı, sınıf/şube ve sınıf rehber öğretmeni zorunlu.');
          return;
        }
      }
      if (dsAdim === DS_ADIMLAR.length - 1) { dsOlustur(); return; }
      setDsAdim(dsAdim + 1);
    };
    const dsGeri = () => setDsAdim(dsAdim - 1);

    async function dsOlustur() {
      setDsYukleniyor(true);
      try {
        await AsyncStorage.setItem(STORAGE_OKUL, dsOkulAdi);
        await AsyncStorage.setItem(STORAGE_KULLANICI_ADI, dsRehber);
        if (dsMudur.trim()) await AsyncStorage.setItem(STORAGE_ZUMRE_MUDUR, dsMudur);

        const formData: DonemSonuFormData = {
          okulAdi: dsOkulAdi, egitimYili: dsEgitimYili, donemLabel: dsDonemLabel,
          sinif: dsSinif, sinifRehberOgretmeni: dsRehber, okulMuduru: dsMudur, tarih: dsTarih,
          kazanimDurumu: dsKazanimDurumu, kazanimAciklama: dsKazanimAciklama,
          uygulananTeknikler: dsTeknikler,
          rehberlikFaaliyetleri: dsFaaliyetler,
          veliFaaliyetleri: dsVeliFaaliyetler,
          yonlendirmeler: dsYonlendirmeler,
          guclukler: dsGuclukler, cozumOnerileri: dsCozum,
          pdrIsbirligi: dsPdrIsbirligi, pdrBeklenti: dsPdrBeklenti,
        };

        const html    = donemSonuHtmlOlustur(formData);
        await pdfOnizlemeAc(html, false);
      } catch {
        Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
      } finally {
        setDsYukleniyor(false);
      }
    }

    return (
      <Screen bg={colors.surface}>
        <AppBar title="Dönem Sonu Raporu" back />

        <View style={s.stepper}>
          {DS_ADIMLAR.map((a, i) => (
            <View key={i} style={s.stepItem}>
              <View style={[s.stepDot, i <= dsAdim && s.stepDotActive]}>
                <Text style={[s.stepNo, i <= dsAdim && s.stepNoActive]}>{i + 1}</Text>
              </View>
              <Text style={[s.stepLabel, i === dsAdim && s.stepLabelActive]}>{a}</Text>
            </View>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {dsAdim === 0 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Temel Bilgiler</Text>
              <Text style={s.adimAlt}>{dsEgitimYili} · Sınıf rehberlik dönem sonu raporu</Text>
              <Alan label="Okul Adı" zorunlu>
                <TextInput style={s.input} value={dsOkulAdi} onChangeText={setDsOkulAdi}
                  placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Dönem" zorunlu>
                <View style={s.chipRow}>
                  {DONEM_SECENEKLERI.map(({ key, label }) => (
                    <TouchableOpacity key={key} style={[s.chip, dsDonem === key && s.chipActive]}
                      onPress={() => { setDsDonem(key); dsVeriyiUygula(dsSinif, key); }} activeOpacity={0.7}>
                      <Text style={[s.chipText, dsDonem === key && s.chipTextActive]}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Alan>
              <Alan label="Sınıf / Şube" zorunlu hint="Aylık raporlardan (yoksa yıllık plandan) otomatik doldurulur">
                <SinifSecici value={dsSinif} onChange={v => { setDsSinif(v); dsVeriyiUygula(v, dsDonem); }} />
              </Alan>
              <Alan label="Sınıf Rehber Öğretmeni" zorunlu>
                <TextInput style={s.input} value={dsRehber} onChangeText={setDsRehber}
                  placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Okul Müdürü">
                <TextInput style={s.input} value={dsMudur} onChangeText={setDsMudur}
                  placeholder="Müdür adı" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Rapor Tarihi">
                <TextInput style={s.input} value={dsTarih} onChangeText={setDsTarih}
                  placeholder="20.06.2025" placeholderTextColor={colors.text3} />
              </Alan>
            </ScrollView>
          )}

          {dsAdim === 1 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Kazanımlar & Teknikler</Text>
              <Alan label="Tüm kazanımlar (yıllık plana göre) gerçekleştirilebildi mi?">
                <View style={s.chipRow}>
                  {KAZANIM_DURUMLARI.map(({ key, label }) => (
                    <TouchableOpacity key={key} style={[s.chip, dsKazanimDurumu === key && s.chipActive]}
                      onPress={() => setDsKazanimDurumu(key)} activeOpacity={0.7}>
                      <Text style={[s.chipText, dsKazanimDurumu === key && s.chipTextActive]}>{label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Alan>
              {dsKazanimDurumu !== 'evet' && (
                <Alan label="Gerçekleştirilemeyen kazanımlar">
                  <TextInput style={[s.input, s.textArea]} value={dsKazanimAciklama} onChangeText={setDsKazanimAciklama}
                    placeholder="Zaman yetersizliği nedeniyle ... kazanımları işlenemedi." placeholderTextColor={colors.text3} multiline />
                </Alan>
              )}
              <Alan label="Uygulanan Teknikler">
                <TextInput style={[s.input, s.textArea]} value={dsTeknikler} onChangeText={setDsTeknikler}
                  placeholder="Otobiyografi, öğrenci tanıma formu, sosyometri..." placeholderTextColor={colors.text3} multiline />
              </Alan>
            </ScrollView>
          )}

          {dsAdim === 2 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Yapılan Rehberlik Faaliyetleri</Text>
              <Text style={s.adimAlt}>Çalışma + katılan kız/erkek sayısı</Text>
              {dsFaaliyetler.map((f, i) => (
                <View key={i} style={s.soruCard}>
                  <View style={s.soruHeader}>
                    <Text style={s.soruNo}>{i + 1}. Çalışma</Text>
                    {dsFaaliyetler.length > 1 && (
                      <TouchableOpacity onPress={() => setDsFaaliyetler(dsFaaliyetler.filter((_, idx) => idx !== i))} style={s.deleteBtn} activeOpacity={0.7}>
                        <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TextInput style={[s.input, { marginBottom: 8 }]} value={f.calisma}
                    onChangeText={t => setDsFaaliyetler(dsFaaliyetler.map((x, idx) => idx === i ? { ...x, calisma: t } : x))}
                    placeholder="Oryantasyon / motivasyon çalışması" placeholderTextColor={colors.text3} />
                  <Text style={s.alanHint}>Katılan öğrenci sayısı</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput style={[s.input, { flex: 1 }]} value={f.kiz}
                      onChangeText={t => setDsFaaliyetler(dsFaaliyetler.map((x, idx) => idx === i ? { ...x, kiz: t } : x))}
                      placeholder="Kız" placeholderTextColor={colors.text3} keyboardType="number-pad" />
                    <TextInput style={[s.input, { flex: 1 }]} value={f.erkek}
                      onChangeText={t => setDsFaaliyetler(dsFaaliyetler.map((x, idx) => idx === i ? { ...x, erkek: t } : x))}
                      placeholder="Erkek" placeholderTextColor={colors.text3} keyboardType="number-pad" />
                  </View>
                </View>
              ))}
              <TouchableOpacity style={s.addBtn} onPress={() => setDsFaaliyetler([...dsFaaliyetler, bosFaaliyetSatiri()])} activeOpacity={0.7}>
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Çalışma Ekle</Text>
              </TouchableOpacity>

              <View style={{ height: 20 }} />
              <Text style={s.adimBaslik}>Velilere Yönelik Faaliyetler</Text>
              <Text style={s.adimAlt}>Çalışma + katılan anne/baba/diğer sayısı</Text>
              {dsVeliFaaliyetler.map((v, i) => (
                <View key={i} style={s.soruCard}>
                  <View style={s.soruHeader}>
                    <Text style={s.soruNo}>{i + 1}. Çalışma</Text>
                    {dsVeliFaaliyetler.length > 1 && (
                      <TouchableOpacity onPress={() => setDsVeliFaaliyetler(dsVeliFaaliyetler.filter((_, idx) => idx !== i))} style={s.deleteBtn} activeOpacity={0.7}>
                        <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <TextInput style={[s.input, { marginBottom: 8 }]} value={v.calisma}
                    onChangeText={t => setDsVeliFaaliyetler(dsVeliFaaliyetler.map((x, idx) => idx === i ? { ...x, calisma: t } : x))}
                    placeholder="Veli Toplantısı" placeholderTextColor={colors.text3} />
                  <Text style={s.alanHint}>Katılan kişi sayısı</Text>
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput style={[s.input, { flex: 1 }]} value={v.anne}
                      onChangeText={t => setDsVeliFaaliyetler(dsVeliFaaliyetler.map((x, idx) => idx === i ? { ...x, anne: t } : x))}
                      placeholder="Anne" placeholderTextColor={colors.text3} keyboardType="number-pad" />
                    <TextInput style={[s.input, { flex: 1 }]} value={v.baba}
                      onChangeText={t => setDsVeliFaaliyetler(dsVeliFaaliyetler.map((x, idx) => idx === i ? { ...x, baba: t } : x))}
                      placeholder="Baba" placeholderTextColor={colors.text3} keyboardType="number-pad" />
                    <TextInput style={[s.input, { flex: 1 }]} value={v.diger}
                      onChangeText={t => setDsVeliFaaliyetler(dsVeliFaaliyetler.map((x, idx) => idx === i ? { ...x, diger: t } : x))}
                      placeholder="Diğer" placeholderTextColor={colors.text3} keyboardType="number-pad" />
                  </View>
                </View>
              ))}
              <TouchableOpacity style={s.addBtn} onPress={() => setDsVeliFaaliyetler([...dsVeliFaaliyetler, bosVeliFaaliyetSatiri()])} activeOpacity={0.7}>
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Veli Çalışması Ekle</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {dsAdim === 3 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>PDR'ye Yönlendirilenler</Text>
              <Text style={s.adimAlt}>İsteğe bağlı</Text>
              {dsYonlendirmeler.map((y, i) => (
                <View key={i} style={s.soruCard}>
                  <View style={s.soruHeader}>
                    <Text style={s.soruNo}>{i + 1}. Öğrenci</Text>
                    <TouchableOpacity onPress={() => setDsYonlendirmeler(dsYonlendirmeler.filter((_, idx) => idx !== i))} style={s.deleteBtn} activeOpacity={0.7}>
                      <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                    </TouchableOpacity>
                  </View>
                  <TextInput style={[s.input, { marginBottom: 8 }]} value={y.adSoyad}
                    onChangeText={t => setDsYonlendirmeler(dsYonlendirmeler.map((x, idx) => idx === i ? { ...x, adSoyad: t } : x))}
                    placeholder="Öğrenci adı soyadı" placeholderTextColor={colors.text3} />
                  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                    <TextInput style={[s.input, { flex: 1 }]} value={y.no}
                      onChangeText={t => setDsYonlendirmeler(dsYonlendirmeler.map((x, idx) => idx === i ? { ...x, no: t } : x))}
                      placeholder="No" placeholderTextColor={colors.text3} keyboardType="number-pad" />
                    <TextInput style={[s.input, { flex: 2 }]} value={y.veli}
                      onChangeText={t => setDsYonlendirmeler(dsYonlendirmeler.map((x, idx) => idx === i ? { ...x, veli: t } : x))}
                      placeholder="Veli adı" placeholderTextColor={colors.text3} />
                  </View>
                  <TextInput style={s.input} value={y.neden}
                    onChangeText={t => setDsYonlendirmeler(dsYonlendirmeler.map((x, idx) => idx === i ? { ...x, neden: t } : x))}
                    placeholder="Yönlendirme nedeni" placeholderTextColor={colors.text3} />
                </View>
              ))}
              <TouchableOpacity style={s.addBtn} onPress={() => setDsYonlendirmeler([...dsYonlendirmeler, bosYonlendirmeSatiri()])} activeOpacity={0.7}>
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Yönlendirme Ekle</Text>
              </TouchableOpacity>

              <View style={{ height: 20 }} />
              <Alan label="Karşılaşılan Güçlükler ve Nedenleri">
                <TextInput style={[s.input, s.textArea]} value={dsGuclukler} onChangeText={setDsGuclukler}
                  placeholder="Dönem içinde karşılaşılan güçlükler..." placeholderTextColor={colors.text3} multiline />
              </Alan>
              <Alan label="Çözüm Önerileri">
                <TextInput style={[s.input, s.textArea]} value={dsCozum} onChangeText={setDsCozum}
                  placeholder="Öneriler..." placeholderTextColor={colors.text3} multiline />
              </Alan>
              <Alan label="Okul PDR Servisi ile İşbirliği">
                <TextInput style={[s.input, s.textArea]} value={dsPdrIsbirligi} onChangeText={setDsPdrIsbirligi}
                  placeholder="Servis ile yürütülen işbirliği..." placeholderTextColor={colors.text3} multiline />
              </Alan>
              <Alan label="PDR Servisinden Beklentiler">
                <TextInput style={[s.input, s.textArea]} value={dsPdrBeklenti} onChangeText={setDsPdrBeklenti}
                  placeholder="Beklentiler..." placeholderTextColor={colors.text3} multiline />
              </Alan>
            </ScrollView>
          )}
        </KeyboardAvoidingView>

        <View style={s.altBar}>
          {dsAdim > 0 ? (
            <TouchableOpacity style={s.geriBtn} onPress={dsGeri} activeOpacity={0.7}>
              <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
              <Text style={s.geriBtnText}>Geri</Text>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity style={[s.ileriBtn, dsYukleniyor && s.ileriDisabled]} onPress={dsIleri} activeOpacity={0.8} disabled={dsYukleniyor}>
            {dsAdim === DS_ADIMLAR.length - 1 ? (
              <>
                <FileDown size={18} color="#fff" strokeWidth={2} />
                <Text style={s.ileriBtnText}>{dsYukleniyor ? 'Oluşturuluyor...' : 'Raporu Oluştur'}</Text>
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

  // ─── Rehberlik Aylık Rapor akışı (Sınıf Rehber Öğretmeni Aylık Çalışma Raporu) ──
  if (isRehberlikAylik) {
    const RB_ADIMLAR = ['Sınıf & Bilgiler', 'Çalışmalar', 'Görüşmeler'];

    const rbHaftaPristine = () => rbHaftalar.every(h => !h.kazanim.trim() && !h.tarih.trim() && !h.etkinlikAdi.trim());

    // Sınıf+ay ikisi de doluysa: haftalık tablo için kayıtlı manuel veri varsa o, yoksa
    // yıllık plandan öneri kullanılır. Test/anket ve diğer çalışmalar plandan türetilemez
    // (kaynak yok), sadece kayıtlı manuel veri varsa geri yüklenir. Zaten doldurulmuş
    // (pristine olmayan) alanların üzerine yazılmaz.
    async function rbVeriyiUygula(sinifDeger: string, ayDeger: string) {
      if (!sinifDeger.trim() || !ayDeger) return;
      const kayit = await rehberlikAylikKaydiOku(sinifDeger, ayDeger);

      if (rbHaftaPristine()) {
        const deger = kayit?.haftalar?.length ? kayit.haftalar : yillikPlandanHaftaOnerisi(sinifDeger, ayDeger);
        if (deger.length) setRbHaftalar(deger);
      }
      if (rbTestAnketler.length === 0 && kayit?.testAnketler?.length) {
        setRbTestAnketler(kayit.testAnketler);
      }
      if (rbDigerCalismalar.every(t => !t.trim()) && kayit?.digerCalismalar?.length) {
        setRbDigerCalismalar(kayit.digerCalismalar);
      }
    }

    function rbAySecilince(ay: string, no: number) {
      setRbAy(ay);
      setRbRaporNo(no);
      rbVeriyiUygula(rbSinif, ay);
    }

    const rbIleri = async () => {
      if (rbAdim === 0) {
        if (!rbOkulAdi.trim() || !rbSinif.trim() || !rbSinifOgretmeni.trim()) {
          Alert.alert('Eksik bilgi', 'Okul adı, sınıf ve sınıf öğretmeni zorunlu.');
          return;
        }
        if (!rbAy) {
          Alert.alert('Eksik bilgi', 'Rapor ayı seçilmeli.');
          return;
        }
        // Sınıf/ay onEndEditing sırasına bağlı kalmadan, adımdan çıkmadan hemen önce
        // garantili uygulanır (kullanıcı chip'i alan bulanıklaşmadan seçmiş olabilir).
        await rbVeriyiUygula(rbSinif, rbAy);
      }
      if (rbAdim === 1) {
        if (rbHaftalar.filter(h => h.kazanim.trim()).length === 0) {
          Alert.alert('Eksik bilgi', 'En az bir haftalık kazanım girilmeli.');
          return;
        }
      }
      if (rbAdim === RB_ADIMLAR.length - 1) {
        rbOlustur();
        return;
      }
      setRbAdim(rbAdim + 1);
    };
    const rbGeri = () => setRbAdim(rbAdim - 1);

    async function rbOlustur() {
      setRbYukleniyor(true);
      try {
        await AsyncStorage.setItem(STORAGE_OKUL, rbOkulAdi);
        await AsyncStorage.setItem(STORAGE_KULLANICI_ADI, rbSinifOgretmeni);
        if (rbMudur.trim()) await AsyncStorage.setItem(STORAGE_ZUMRE_MUDUR, rbMudur);

        const haftalar = rbHaftalar
          .filter(h => h.kazanim.trim())
          .map((h, i) => ({ ...h, sira: i + 1 }));
        const testAnketler = rbTestAnketler
          .filter(t => t.adi.trim())
          .map((t, i) => ({ ...t, sira: i + 1 }));
        const digerCalismalar = rbDigerCalismalar.filter(t => t.trim());

        const formData: AylikRehberlikFormData = {
          okulAdi: rbOkulAdi,
          egitimYili: rbEgitimYili,
          sinif: rbSinif,
          ay: rbAy,
          raporNo: rbRaporNo,
          raporTarihi: rbRaporTarihi,
          sinifMevcudu: parseInt(rbSinifMevcudu, 10) || 0,
          sinifOgretmeni: rbSinifOgretmeni,
          okulRehberOgretmeni: rbRehberOgretmeni,
          okulMuduru: rbMudur,
          haftalar, testAnketler, digerCalismalar,
          veliGorusmeleri: rbVeliGorusmeleri
            .filter(v => v.adSoyad.trim() || v.konu.trim())
            .map((v, i) => ({ ...v, sira: i + 1 })),
          ogrenciGorusmeleri: rbOgrenciGorusmeleri
            .filter(o => o.adSoyad.trim() || o.konu.trim())
            .map((o, i) => ({ ...o, sira: i + 1 })),
        };

        await rehberlikAylikKaydiYaz(rbSinif, rbAy, { haftalar, testAnketler, digerCalismalar });

        const html    = aylikRehberlikHtmlOlustur(formData);
        await pdfOnizlemeAc(html, false);
      } catch {
        Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
      } finally {
        setRbYukleniyor(false);
      }
    }

    return (
      <Screen bg={colors.surface}>
        <AppBar title="Aylık Rehberlik Raporu" back />

        <View style={s.stepper}>
          {RB_ADIMLAR.map((a, i) => (
            <View key={i} style={s.stepItem}>
              <View style={[s.stepDot, i <= rbAdim && s.stepDotActive]}>
                <Text style={[s.stepNo, i <= rbAdim && s.stepNoActive]}>{i + 1}</Text>
              </View>
              <Text style={[s.stepLabel, i === rbAdim && s.stepLabelActive]}>{a}</Text>
            </View>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {rbAdim === 0 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Sınıf & Bilgiler</Text>
              <Text style={s.adimAlt}>{rbEgitimYili} · Aylık rehberlik çalışma raporu</Text>

              <Alan label="Okul Adı" zorunlu>
                <TextInput style={s.input} value={rbOkulAdi} onChangeText={setRbOkulAdi}
                  placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Sınıf" zorunlu>
                <SinifSecici value={rbSinif} onChange={v => { setRbSinif(v); rbVeriyiUygula(v, rbAy); }} />
              </Alan>

              <Alan label="Rapor Ayı" zorunlu>
                <View style={s.chipRow}>
                  {REHBERLIK_AYLARI.map(({ ad, no }) => (
                    <TouchableOpacity
                      key={ad}
                      style={[s.chip, rbAy === ad && s.chipActive]}
                      onPress={() => rbAySecilince(ad, no)}
                      activeOpacity={0.7}
                    >
                      <Text style={[s.chipText, rbAy === ad && s.chipTextActive]}>{ad}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </Alan>

              <Alan label="Rapor Tarihi" zorunlu>
                <TextInput style={s.input} value={rbRaporTarihi} onChangeText={setRbRaporTarihi}
                  placeholder="30.09.2025" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Sınıf Mevcudu">
                <TextInput style={s.input} value={rbSinifMevcudu} onChangeText={setRbSinifMevcudu}
                  placeholder="22" placeholderTextColor={colors.text3} keyboardType="number-pad" />
              </Alan>
              <Alan label="Sınıf Öğretmeni" zorunlu>
                <TextInput style={s.input} value={rbSinifOgretmeni} onChangeText={setRbSinifOgretmeni}
                  placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Okul Rehber Öğretmeni">
                <TextInput style={s.input} value={rbRehberOgretmeni} onChangeText={setRbRehberOgretmeni}
                  placeholder="Rehber öğretmen adı" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Okul Müdürü">
                <TextInput style={s.input} value={rbMudur} onChangeText={setRbMudur}
                  placeholder="Müdür adı" placeholderTextColor={colors.text3} />
              </Alan>

              {rbAy !== '' && (
                <View style={s.infoCard}>
                  <Text style={s.infoText}>
                    Rapor No: <Text style={s.infoVurgu}>{rbRaporNo}</Text>
                    {'  '}· {rbAy} ayı ·{' '}
                    {rbHaftalar.filter(h => h.kazanim.trim()).length > 0
                      ? <Text style={s.infoVurgu}>Yıllık plandan {rbHaftalar.filter(h => h.kazanim.trim()).length} haftalık kazanım aktarıldı.</Text>
                      : 'Yıllık plandan öneri bulunamadı, elle gireceksin.'}
                    {' '}Sonraki adımda düzenleyebilirsin.
                  </Text>
                </View>
              )}
            </ScrollView>
          )}

          {rbAdim === 1 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <View style={{ marginBottom: 18 }}>
                <Text style={s.adimBaslik}>Haftalık Çalışmalar</Text>
                <Text style={s.adimAlt}>Yıllık plandan aktarıldı — yeterlik alanı/etkinlik adı boşsa kaynakta eşleşme bulunamadı, elle girebilirsin</Text>
                {rbHaftalar.map((h, i) => (
                  <View key={i} style={s.soruCard}>
                    <View style={s.soruHeader}>
                      <Text style={s.soruNo}>{i + 1}. Hafta</Text>
                      {rbHaftalar.length > 1 && (
                        <TouchableOpacity
                          onPress={() => setRbHaftalar(rbHaftalar.filter((_, idx) => idx !== i))}
                          style={s.deleteBtn} activeOpacity={0.7}
                        >
                          <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                        </TouchableOpacity>
                      )}
                    </View>
                    <TextInput style={[s.input, { marginBottom: 8 }]} value={h.tarih}
                      onChangeText={t => setRbHaftalar(rbHaftalar.map((x, idx) => idx === i ? { ...x, tarih: t } : x))}
                      placeholder="Tarih (ör. 8-12 Eylül 2025)" placeholderTextColor={colors.text3} />
                    <TextInput style={[s.input, { marginBottom: 8 }]} value={h.yeterlikAlani}
                      onChangeText={t => setRbHaftalar(rbHaftalar.map((x, idx) => idx === i ? { ...x, yeterlikAlani: t } : x))}
                      placeholder="Yeterlik alanı (ör. Benlik Farkındalığı)" placeholderTextColor={colors.text3} />
                    <TextInput style={[s.input, s.textArea, { marginBottom: 8 }]} value={h.kazanim}
                      onChangeText={t => setRbHaftalar(rbHaftalar.map((x, idx) => idx === i ? { ...x, kazanim: t } : x))}
                      placeholder="Kazanım" placeholderTextColor={colors.text3} multiline />
                    <TextInput style={s.input} value={h.etkinlikAdi}
                      onChangeText={t => setRbHaftalar(rbHaftalar.map((x, idx) => idx === i ? { ...x, etkinlikAdi: t } : x))}
                      placeholder="Etkinliğin adı (ör. YAŞAM KARNEM)" placeholderTextColor={colors.text3} />
                  </View>
                ))}
                <TouchableOpacity style={s.addBtn}
                  onPress={() => setRbHaftalar([...rbHaftalar, bosHaftaSatiri(rbHaftalar.length + 1)])}
                  activeOpacity={0.7}>
                  <Plus size={16} color={colors.accent} strokeWidth={2} />
                  <Text style={s.addBtnText}>Hafta Ekle</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 18 }}>
                <Text style={s.adimBaslik}>Uygulanan Test ve Anketler</Text>
                <Text style={s.adimAlt}>İsteğe bağlı — uygulanmadıysa boş bırakabilirsin</Text>
                {rbTestAnketler.map((t, i) => (
                  <View key={i} style={s.soruCard}>
                    <View style={s.soruHeader}>
                      <Text style={s.soruNo}>{i + 1}. Test/Anket</Text>
                      <TouchableOpacity
                        onPress={() => setRbTestAnketler(rbTestAnketler.filter((_, idx) => idx !== i))}
                        style={s.deleteBtn} activeOpacity={0.7}
                      >
                        <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                      </TouchableOpacity>
                    </View>
                    <TextInput style={[s.input, { marginBottom: 8 }]} value={t.adi}
                      onChangeText={v => setRbTestAnketler(rbTestAnketler.map((x, idx) => idx === i ? { ...x, adi: v } : x))}
                      placeholder="Test/anket adı (ör. RİBA)" placeholderTextColor={colors.text3} />
                    <TextInput style={[s.input, { marginBottom: 8 }]} value={t.tarih}
                      onChangeText={v => setRbTestAnketler(rbTestAnketler.map((x, idx) => idx === i ? { ...x, tarih: v } : x))}
                      placeholder="Uygulama tarihi" placeholderTextColor={colors.text3} />
                    <Text style={s.alanHint}>Katılan öğrenci sayısı</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TextInput style={[s.input, { flex: 1 }]} value={t.kiz}
                        onChangeText={v => setRbTestAnketler(rbTestAnketler.map((x, idx) => idx === i ? { ...x, kiz: v } : x))}
                        placeholder="Kız" placeholderTextColor={colors.text3} keyboardType="number-pad" />
                      <TextInput style={[s.input, { flex: 1 }]} value={t.erkek}
                        onChangeText={v => setRbTestAnketler(rbTestAnketler.map((x, idx) => idx === i ? { ...x, erkek: v } : x))}
                        placeholder="Erkek" placeholderTextColor={colors.text3} keyboardType="number-pad" />
                      <TextInput style={[s.input, { flex: 1 }]} value={t.toplam}
                        onChangeText={v => setRbTestAnketler(rbTestAnketler.map((x, idx) => idx === i ? { ...x, toplam: v } : x))}
                        placeholder="Toplam" placeholderTextColor={colors.text3} keyboardType="number-pad" />
                    </View>
                  </View>
                ))}
                <TouchableOpacity style={s.addBtn}
                  onPress={() => setRbTestAnketler([...rbTestAnketler, bosTestAnketSatiri(rbTestAnketler.length + 1)])}
                  activeOpacity={0.7}>
                  <Plus size={16} color={colors.accent} strokeWidth={2} />
                  <Text style={s.addBtnText}>Test/Anket Ekle</Text>
                </TouchableOpacity>
              </View>

              <View style={{ marginBottom: 18 }}>
                <Text style={s.adimBaslik}>Diğer Çalışmalar</Text>
                <Text style={s.adimAlt}>İsteğe bağlı</Text>
                {rbDigerCalismalar.map((deger, i) => (
                  <View key={i} style={s.soruCard}>
                    <View style={s.soruHeader}>
                      <Text style={s.soruNo}>{i + 1}. Çalışma</Text>
                      {rbDigerCalismalar.length > 1 && (
                        <TouchableOpacity
                          onPress={() => setRbDigerCalismalar(rbDigerCalismalar.filter((_, idx) => idx !== i))}
                          style={s.deleteBtn} activeOpacity={0.7}
                        >
                          <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                        </TouchableOpacity>
                      )}
                    </View>
                    <TextInput
                      style={[s.input, s.textArea]}
                      value={deger}
                      onChangeText={v => setRbDigerCalismalar(rbDigerCalismalar.map((x, idx) => idx === i ? v : x))}
                      placeholder="Diğer çalışma"
                      placeholderTextColor={colors.text3}
                      multiline
                    />
                  </View>
                ))}
                <TouchableOpacity style={s.addBtn} onPress={() => setRbDigerCalismalar([...rbDigerCalismalar, ''])} activeOpacity={0.7}>
                  <Plus size={16} color={colors.accent} strokeWidth={2} />
                  <Text style={s.addBtnText}>Çalışma Ekle</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          {rbAdim === 2 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Velilerle Yapılan Görüşmeler</Text>
              <Text style={s.adimAlt}>İsteğe bağlı — görüşme yoksa boş bırakabilirsin</Text>
              {rbVeliGorusmeleri.map((v, i) => (
                <View key={i} style={s.soruCard}>
                  <View style={s.soruHeader}>
                    <Text style={s.soruNo}>{i + 1}. Veli</Text>
                    <TouchableOpacity
                      onPress={() => setRbVeliGorusmeleri(rbVeliGorusmeleri.filter((_, idx) => idx !== i))}
                      style={s.deleteBtn} activeOpacity={0.7}
                    >
                      <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                    </TouchableOpacity>
                  </View>
                  <TextInput style={[s.input, { marginBottom: 8 }]} value={v.adSoyad}
                    onChangeText={t => setRbVeliGorusmeleri(rbVeliGorusmeleri.map((x, idx) => idx === i ? { ...x, adSoyad: t } : x))}
                    placeholder="Veli adı soyadı" placeholderTextColor={colors.text3} />
                  <TextInput style={[s.input, { marginBottom: 8 }]} value={v.ogrencisi}
                    onChangeText={t => setRbVeliGorusmeleri(rbVeliGorusmeleri.map((x, idx) => idx === i ? { ...x, ogrencisi: t } : x))}
                    placeholder="Öğrencisi (ad soyad)" placeholderTextColor={colors.text3} />
                  <TextInput style={[s.input, { marginBottom: 8 }]} value={v.konu}
                    onChangeText={t => setRbVeliGorusmeleri(rbVeliGorusmeleri.map((x, idx) => idx === i ? { ...x, konu: t } : x))}
                    placeholder="Görüşme konusu" placeholderTextColor={colors.text3} />
                  <TextInput style={s.input} value={v.tarih}
                    onChangeText={t => setRbVeliGorusmeleri(rbVeliGorusmeleri.map((x, idx) => idx === i ? { ...x, tarih: t } : x))}
                    placeholder="Tarih" placeholderTextColor={colors.text3} />
                </View>
              ))}
              <TouchableOpacity style={s.addBtn}
                onPress={() => setRbVeliGorusmeleri([...rbVeliGorusmeleri, bosVeliGorusmeSatiri(rbVeliGorusmeleri.length + 1)])}
                activeOpacity={0.7}>
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Veli Görüşmesi Ekle</Text>
              </TouchableOpacity>

              <View style={{ height: 20 }} />
              <Text style={s.adimBaslik}>Öğrencilerle Yapılan Görüşmeler</Text>
              <Text style={s.adimAlt}>İsteğe bağlı</Text>
              {rbOgrenciGorusmeleri.map((o, i) => (
                <View key={i} style={s.soruCard}>
                  <View style={s.soruHeader}>
                    <Text style={s.soruNo}>{i + 1}. Öğrenci</Text>
                    <TouchableOpacity
                      onPress={() => setRbOgrenciGorusmeleri(rbOgrenciGorusmeleri.filter((_, idx) => idx !== i))}
                      style={s.deleteBtn} activeOpacity={0.7}
                    >
                      <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                    </TouchableOpacity>
                  </View>
                  <TextInput style={[s.input, { marginBottom: 8 }]} value={o.ogrenciNo}
                    onChangeText={t => setRbOgrenciGorusmeleri(rbOgrenciGorusmeleri.map((x, idx) => idx === i ? { ...x, ogrenciNo: t } : x))}
                    placeholder="Okul no" placeholderTextColor={colors.text3} keyboardType="number-pad" />
                  <TextInput style={[s.input, { marginBottom: 8 }]} value={o.adSoyad}
                    onChangeText={t => setRbOgrenciGorusmeleri(rbOgrenciGorusmeleri.map((x, idx) => idx === i ? { ...x, adSoyad: t } : x))}
                    placeholder="Öğrenci adı soyadı" placeholderTextColor={colors.text3} />
                  <TextInput style={[s.input, { marginBottom: 8 }]} value={o.konu}
                    onChangeText={t => setRbOgrenciGorusmeleri(rbOgrenciGorusmeleri.map((x, idx) => idx === i ? { ...x, konu: t } : x))}
                    placeholder="Görüşme konusu" placeholderTextColor={colors.text3} />
                  <TextInput style={s.input} value={o.tarih}
                    onChangeText={t => setRbOgrenciGorusmeleri(rbOgrenciGorusmeleri.map((x, idx) => idx === i ? { ...x, tarih: t } : x))}
                    placeholder="Tarih" placeholderTextColor={colors.text3} />
                </View>
              ))}
              <TouchableOpacity style={s.addBtn}
                onPress={() => setRbOgrenciGorusmeleri([...rbOgrenciGorusmeleri, bosOgrenciGorusmeSatiri(rbOgrenciGorusmeleri.length + 1)])}
                activeOpacity={0.7}>
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Öğrenci Görüşmesi Ekle</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </KeyboardAvoidingView>

        <View style={s.altBar}>
          {rbAdim > 0 ? (
            <TouchableOpacity style={s.geriBtn} onPress={rbGeri} activeOpacity={0.7}>
              <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
              <Text style={s.geriBtnText}>Geri</Text>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity
            style={[s.ileriBtn, rbYukleniyor && s.ileriDisabled]}
            onPress={rbIleri} activeOpacity={0.8} disabled={rbYukleniyor}
          >
            {rbAdim === RB_ADIMLAR.length - 1 ? (
              <>
                <FileDown size={18} color="#fff" strokeWidth={2} />
                <Text style={s.ileriBtnText}>{rbYukleniyor ? 'Oluşturuluyor...' : 'Raporu Oluştur'}</Text>
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
        await pdfOnizlemeAc(html, true);
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
        await pdfOnizlemeAc(html, true);
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

  // ─── Yoklama ve Karar Defteri akışı ───────────────────────────────────
  if (isYoklamaKarar) {
    const Y_ADIMLAR = ['Temel Bilgiler', 'Öğrenci Listesi', 'Karar Kayıtları'];

    const yIleri = () => {
      if (yAdim === 0 && (!yOkulAdi.trim() || !yDanisman.trim())) {
        Alert.alert('Eksik bilgi', 'Okul adı ve danışman öğretmen adı zorunlu.');
        return;
      }
      if (yAdim === 2 && yKararlar.every(k => !k.kararTarihi.trim() && !k.kararMetni.trim())) {
        Alert.alert('Eksik bilgi', 'En az bir karar kaydı doldurulmalı.');
        return;
      }
      if (yAdim < Y_ADIMLAR.length - 1) setYAdim(yAdim + 1);
      else yOlustur();
    };
    const yGeri = () => setYAdim(yAdim - 1);

    async function yOlustur() {
      setYYukleniyor(true);
      try {
        await AsyncStorage.setItem(STORAGE_OKUL, yOkulAdi);
        await AsyncStorage.setItem(STORAGE_KULLANICI_ADI, yDanisman);

        const formData: YoklamaKararFormData = {
          okulAdi: yOkulAdi,
          kulupAdi: sablonAdi,
          egitimYili: yEgitimYili,
          danismanOgretmen: yDanisman,
          ogrenciler: yOgrenciler.filter(o => o.adSoyad.trim()),
          kararlar: yKararlar.filter(k => k.kararTarihi.trim() || k.kararMetni.trim()),
        };

        const html    = yoklamaKararHtmlOlustur(formData);
        await pdfOnizlemeAc(html, false);
      } catch (e) {
        Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
      } finally {
        setYYukleniyor(false);
      }
    }

    return (
      <Screen bg={colors.surface}>
        <AppBar title={sablonAdi} back />

        <View style={s.stepper}>
          {Y_ADIMLAR.map((a, i) => (
            <View key={i} style={s.stepItem}>
              <View style={[s.stepDot, i <= yAdim && s.stepDotActive]}>
                <Text style={[s.stepNo, i <= yAdim && s.stepNoActive]}>{i + 1}</Text>
              </View>
              <Text style={[s.stepLabel, i === yAdim && s.stepLabelActive]}>{a}</Text>
            </View>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {yAdim === 0 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Temel Bilgiler</Text>
              <Text style={s.adimAlt}>{sablonAdi} — Yoklama ve Karar Defteri</Text>

              <Alan label="Okul Adı" zorunlu>
                <TextInput style={s.input} value={yOkulAdi} onChangeText={setYOkulAdi}
                  placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Danışman Öğretmen" zorunlu>
                <TextInput style={s.input} value={yDanisman} onChangeText={setYDanisman}
                  placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
              </Alan>

              <View style={s.infoCard}>
                <Text style={s.infoText}>
                  Eğitim yılı: <Text style={s.infoVurgu}>{yEgitimYili}</Text>
                  {'\n'}Öğrenci listesi ve her toplantı için karar kaydı bu defterde tutulur.
                </Text>
              </View>
            </ScrollView>
          )}

          {yAdim === 1 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Öğrenci Listesi</Text>
              <Text style={s.adimAlt}>Kulüp üyesi öğrencileri ekle</Text>

              {yOgrenciler.map((o, i) => (
                <View key={o.no} style={s.soruCard}>
                  <View style={s.soruHeader}>
                    <Text style={s.soruNo}>{i + 1}. Öğrenci</Text>
                    {yOgrenciler.length > 1 && (
                      <TouchableOpacity
                        onPress={() => setYOgrenciler(yOgrenciler.filter((_, idx) => idx !== i))}
                        style={s.deleteBtn}
                      >
                        <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Alan label="Adı Soyadı">
                    <TextInput
                      style={s.input}
                      value={o.adSoyad}
                      onChangeText={v => setYOgrenciler(yOgrenciler.map((x, idx) => idx === i ? { ...x, adSoyad: v } : x))}
                      placeholder="Ad Soyad"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Okul No">
                    <TextInput
                      style={s.input}
                      value={o.okulNo}
                      onChangeText={v => setYOgrenciler(yOgrenciler.map((x, idx) => idx === i ? { ...x, okulNo: v } : x))}
                      placeholder="123"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Sınıf ve Şubesi">
                    <TextInput
                      style={s.input}
                      value={o.sinifSube}
                      onChangeText={v => setYOgrenciler(yOgrenciler.map((x, idx) => idx === i ? { ...x, sinifSube: v } : x))}
                      placeholder="9/A"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Kulüpteki Görevi">
                    <TextInput
                      style={s.input}
                      value={o.gorev}
                      onChangeText={v => setYOgrenciler(yOgrenciler.map((x, idx) => idx === i ? { ...x, gorev: v } : x))}
                      placeholder="Üye / Temsilci"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                </View>
              ))}

              <TouchableOpacity
                style={s.addBtn}
                onPress={() => setYOgrenciler([...yOgrenciler, bosOgrenciSatiri(yOgrenciler.length + 1)])}
                activeOpacity={0.7}
              >
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Öğrenci Ekle</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {yAdim === 2 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Karar Kayıtları</Text>
              <Text style={s.adimAlt}>Her toplantı için ayrı bir karar kaydı ekle</Text>

              {yKararlar.map((k, i) => (
                <View key={k.no} style={s.soruCard}>
                  <View style={s.soruHeader}>
                    <Text style={s.soruNo}>{i + 1}. Karar Kaydı</Text>
                    {yKararlar.length > 1 && (
                      <TouchableOpacity
                        onPress={() => setYKararlar(yKararlar.filter((_, idx) => idx !== i))}
                        style={s.deleteBtn}
                      >
                        <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                      </TouchableOpacity>
                    )}
                  </View>
                  <Alan label="Karar Numarası">
                    <TextInput
                      style={s.input}
                      value={k.kararNo}
                      onChangeText={v => setYKararlar(yKararlar.map((x, idx) => idx === i ? { ...x, kararNo: v } : x))}
                      placeholder="1"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Karar Tarihi">
                    <TextInput
                      style={s.input}
                      value={k.kararTarihi}
                      onChangeText={v => setYKararlar(yKararlar.map((x, idx) => idx === i ? { ...x, kararTarihi: v } : x))}
                      placeholder="15/10/2025"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Gündem Maddeleri" hint="Her maddeyi ayrı satıra yaz">
                    <TextInput
                      style={[s.input, s.textArea]}
                      value={k.gundemMaddeleri}
                      onChangeText={v => setYKararlar(yKararlar.map((x, idx) => idx === i ? { ...x, gundemMaddeleri: v } : x))}
                      placeholder="Kulüp çalışma takviminin görüşülmesi"
                      placeholderTextColor={colors.text3}
                      multiline
                    />
                  </Alan>
                  <Alan label="Karar Metni" hint="Her kararı ayrı satıra yaz">
                    <TextInput
                      style={[s.input, s.textArea]}
                      value={k.kararMetni}
                      onChangeText={v => setYKararlar(yKararlar.map((x, idx) => idx === i ? { ...x, kararMetni: v } : x))}
                      placeholder="Çalışma takviminin oy birliğiyle kabulüne karar verildi"
                      placeholderTextColor={colors.text3}
                      multiline
                    />
                  </Alan>
                  <Alan label="Çalışma Tarihi">
                    <TextInput
                      style={s.input}
                      value={k.calismaTarihi}
                      onChangeText={v => setYKararlar(yKararlar.map((x, idx) => idx === i ? { ...x, calismaTarihi: v } : x))}
                      placeholder="15/10/2025"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Çalışma Saati">
                    <TextInput
                      style={s.input}
                      value={k.calismaSaati}
                      onChangeText={v => setYKararlar(yKararlar.map((x, idx) => idx === i ? { ...x, calismaSaati: v } : x))}
                      placeholder="14:00"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="Kulüp Mevcudu">
                    <TextInput
                      style={s.input}
                      value={k.kulupMevcudu}
                      onChangeText={v => setYKararlar(yKararlar.map((x, idx) => idx === i ? { ...x, kulupMevcudu: v } : x))}
                      placeholder="18"
                      placeholderTextColor={colors.text3}
                    />
                  </Alan>
                  <Alan label="İşlenen Konu, Yapılan Etkinlik">
                    <TextInput
                      style={[s.input, s.textArea]}
                      value={k.islenenKonu}
                      onChangeText={v => setYKararlar(yKararlar.map((x, idx) => idx === i ? { ...x, islenenKonu: v } : x))}
                      placeholder="Kulüp tanıtımı ve görev dağılımı"
                      placeholderTextColor={colors.text3}
                      multiline
                    />
                  </Alan>
                  <Alan label="Katılamayan Kulüp Üyeleri" hint="Her öğrenciyi ayrı satıra yaz (örn. 123 - 9/A)">
                    <TextInput
                      style={[s.input, s.textArea]}
                      value={k.katilmayanlar}
                      onChangeText={v => setYKararlar(yKararlar.map((x, idx) => idx === i ? { ...x, katilmayanlar: v } : x))}
                      placeholder="123 - 9/A"
                      placeholderTextColor={colors.text3}
                      multiline
                    />
                  </Alan>
                </View>
              ))}

              <TouchableOpacity
                style={s.addBtn}
                onPress={() => setYKararlar([...yKararlar, bosKararSatiri(yKararlar.length + 1)])}
                activeOpacity={0.7}
              >
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Karar Kaydı Ekle</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </KeyboardAvoidingView>

        <View style={s.altBar}>
          {yAdim > 0 ? (
            <TouchableOpacity style={s.geriBtn} onPress={yGeri} activeOpacity={0.7}>
              <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
              <Text style={s.geriBtnText}>Geri</Text>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity
            style={[s.ileriBtn, yYukleniyor && s.ileriDisabled]}
            onPress={yIleri} activeOpacity={0.8} disabled={yYukleniyor}
          >
            {yAdim === Y_ADIMLAR.length - 1 ? (
              <>
                <FileDown size={18} color="#fff" strokeWidth={2} />
                <Text style={s.ileriBtnText}>{yYukleniyor ? 'Oluşturuluyor...' : 'Evrakı Oluştur'}</Text>
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

  // ─── Performans Notu akışı ─────────────────────────────────────────────
  if (isPerformans) {
    const P_ADIMLAR = ['Temel Bilgiler', 'Şablon Seç', 'Öğrenci Listesi', 'Puanlama'];
    const pSablon   = PERFORMANS_SABLONLARI.find(sb => sb.id === pSablonId)!;
    const kriterler = pSablon.kriterler;

    const pSablonSec = (id: 'birinci' | 'ikinci') => {
      setPSablonId(id);
      const yeniKriterSayisi = PERFORMANS_SABLONLARI.find(sb => sb.id === id)!.kriterler.length;
      setPOgrenciler(prev => prev.map(o => ({ ...o, puanlar: new Array(yeniKriterSayisi).fill(0) })));
    };

    const pKirilimAcKapa = (i: number) => setPAcikKirilim(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

    const pTumunuDagit = () => {
      setPOgrenciler(pOgrenciler.map(o => {
        const asilNot = Math.min(100, Math.max(0, parseInt(o.asilNot, 10) || 0));
        if (!o.asilNot.trim()) return o;
        return { ...o, puanlar: notuKriterlereDagit(asilNot, kriterler) };
      }));
    };

    // Asıl not girişi bitince (alandan çıkınca): o öğrenciye otomatik dağıt +
    // kırılımını aç, diğerlerini kapat. Not değişmemişse yeniden randomize etme.
    const pNotCommit = (i: number) => {
      const o = pOgrenciler[i];
      if (!o.asilNot.trim()) return;
      const asilNot = Math.min(100, Math.max(0, parseInt(o.asilNot, 10) || 0));
      if (asilNot <= 0) return;
      setPAcikKirilim(new Set([i]));
      const mevcutToplam = o.puanlar.reduce((a, b) => a + b, 0);
      if (mevcutToplam === asilNot) return;
      setPOgrenciler(pOgrenciler.map((x, idx) => idx === i
        ? { ...x, puanlar: notuKriterlereDagit(asilNot, kriterler) } : x));
    };

    // Roster satırlarını depolama formatına ("123 Ahmet Yılmaz") serileştir.
    const rosterMetni = (r: { okulNo: string; adSoyad: string }[]) =>
      r.map(x => `${x.okulNo ? x.okulNo + ' ' : ''}${x.adSoyad.trim()}`.trim()).filter(Boolean).join('\n');

    const pRosterEkle = () => setPRoster([...pRoster, { okulNo: '', adSoyad: '' }]);
    const pRosterSil = (i: number) => setPRoster(pRoster.filter((_, idx) => idx !== i));
    const pRosterGuncelle = (i: number, alan: 'okulNo' | 'adSoyad', deger: string) =>
      setPRoster(pRoster.map((r, idx) => idx === i ? { ...r, [alan]: deger } : r));

    // Öğrenci Listesi adımına ilk girişte, aynı sınıf için kaydedilmiş liste varsa otomatik doldur.
    const pListeYukle = async () => {
      if (pRoster.length > 0) return;
      const kayitli = await AsyncStorage.getItem(performansRosterKey(pSinif));
      const parsed = kayitli ? parsePerformansSatirlari(kayitli) : [];
      setPRoster(parsed.length > 0 ? parsed : [{ okulNo: '', adSoyad: '' }]);
    };

    // Puanlama adımına geçerken listeyi kaydet + pOgrenciler'i (var olan notları koruyarak) yeniden kur.
    const pListeyiUygula = async () => {
      const satirlar = pRoster.filter(r => r.adSoyad.trim());
      setPOgrenciler(satirlar.map((satir, i) => {
        const eski = pOgrenciler[i];
        const ayniIsim = eski?.adSoyad === satir.adSoyad;
        return {
          no: i + 1,
          okulNo: satir.okulNo || eski?.okulNo || '',
          adSoyad: satir.adSoyad.trim(),
          asilNot: ayniIsim ? eski.asilNot : '',
          puanlar: ayniIsim ? eski.puanlar : new Array(kriterler.length).fill(0),
        };
      }));
      await AsyncStorage.setItem(performansRosterKey(pSinif), rosterMetni(satirlar));
    };

    const pIleri = () => {
      if (pAdim === 0 && (!pDersAdi.trim() || !pOgretmen.trim())) {
        Alert.alert('Eksik bilgi', 'Ders adı ve öğretmen adı zorunlu.');
        return;
      }
      if (pAdim === 1) { pListeYukle(); setPAdim(pAdim + 1); return; }
      if (pAdim === 2) {
        if (!pRoster.some(r => r.adSoyad.trim())) {
          Alert.alert('Eksik bilgi', 'En az bir öğrenci eklenmeli.');
          return;
        }
        pListeyiUygula();
        setPAdim(pAdim + 1);
        return;
      }
      if (pAdim < P_ADIMLAR.length - 1) setPAdim(pAdim + 1);
      else pOlustur();
    };
    const pGeri = () => setPAdim(pAdim - 1);

    async function pOlustur() {
      setPYukleniyor(true);
      try {
        await AsyncStorage.setItem(STORAGE_OKUL, pOkulAdi);
        await AsyncStorage.setItem(STORAGE_KULLANICI_ADI, pOgretmen);

        const ogrenciler: PerformansOgrenciSatiri[] = pOgrenciler
          .filter(o => o.adSoyad.trim())
          .map((o, i) => ({ no: i + 1, okulNo: o.okulNo, adSoyad: o.adSoyad, puanlar: o.puanlar }));

        const formData: PerformansFormData = {
          okulAdi: pOkulAdi,
          sinif: pSinif,
          dersAdi: pDersAdi,
          egitimYili: pEgitimYili,
          donemBaslik: pSablon.ad + ' Değerlendirme Çizelgesi',
          tarih: pTarih,
          ogretmen: pOgretmen,
          mudur: pMudur,
          kriterler,
          ogrenciler,
        };

        const html    = performansHtmlOlustur(formData);
        await pdfOnizlemeAc(html, false);
      } catch (e) {
        Alert.alert('Hata', 'PDF oluşturulurken bir sorun oluştu.');
      } finally {
        setPYukleniyor(false);
      }
    }

    return (
      <Screen bg={colors.surface}>
        <AppBar title="Performans Notu" back />

        <View style={s.stepper}>
          {P_ADIMLAR.map((a, i) => (
            <View key={i} style={s.stepItem}>
              <View style={[s.stepDot, i <= pAdim && s.stepDotActive]}>
                <Text style={[s.stepNo, i <= pAdim && s.stepNoActive]}>{i + 1}</Text>
              </View>
              <Text style={[s.stepLabel, i === pAdim && s.stepLabelActive]}>{a}</Text>
            </View>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {pAdim === 0 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Temel Bilgiler</Text>
              <Text style={s.adimAlt}>Performans notu değerlendirme çizelgesi</Text>

              <Text style={s.grupBaslik}>BELGE BİLGİLERİ</Text>
              <Alan label="Okul Adı">
                <TextInput style={s.input} value={pOkulAdi} onChangeText={setPOkulAdi}
                  placeholder="Atatürk Anadolu Lisesi" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Sınıf">
                <SinifSecici value={pSinif} onChange={setPSinif} />
              </Alan>
              <Alan label="Ders Adı" zorunlu>
                <DersSecici value={pDersAdi} onChange={setPDersAdi} />
              </Alan>

              <Text style={[s.grupBaslik, { marginTop: spacing.lg }]}>ÖĞRETMEN & İMZA</Text>
              <Alan label="Ders Öğretmeni" zorunlu>
                <TextInput style={s.input} value={pOgretmen} onChangeText={setPOgretmen}
                  placeholder="Adınız Soyadınız" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Okul Müdürü" hint="Opsiyonel — boş bırakılırsa belgede müdür imza satırı yer almaz">
                <TextInput style={s.input} value={pMudur} onChangeText={setPMudur}
                  placeholder="Ad Soyad" placeholderTextColor={colors.text3} />
              </Alan>
              <Alan label="Tarih" zorunlu>
                <TextInput style={s.input} value={pTarih} onChangeText={setPTarih}
                  placeholder="15 Ocak 2026" placeholderTextColor={colors.text3} />
              </Alan>
            </ScrollView>
          )}

          {pAdim === 1 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Şablon Seç</Text>
              <Text style={s.adimAlt}>Kriterler ve ağırlıkları şablona göre otomatik gelir</Text>

              <View style={s.chipRow}>
                {PERFORMANS_SABLONLARI.map(sb => (
                  <TouchableOpacity
                    key={sb.id}
                    style={[s.chip, pSablonId === sb.id && s.chipActive]}
                    onPress={() => pSablonSec(sb.id)}
                  >
                    <Text style={[s.chipText, pSablonId === sb.id && s.chipTextActive]}>{sb.ad}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={[s.kriterListe, { marginTop: spacing.base }]}>
                <View style={s.kriterListeHeader}>
                  <Text style={s.kriterListeBaslik}>KRİTERLER</Text>
                  <Text style={s.kriterListeSayi}>{kriterler.length} madde</Text>
                </View>
                {kriterler.map((k, ki) => (
                  <View key={ki} style={[s.kriterListeRow, ki === kriterler.length - 1 && s.kriterListeRowSon]}>
                    <Text style={s.kriterListeAd}>{k.ad}</Text>
                    <View style={s.kriterListePill}>
                      <Text style={s.kriterListePuan}>{k.puan}</Text>
                    </View>
                  </View>
                ))}
                <View style={s.kriterListeFooter}>
                  <Text style={s.kriterListeToplamLabel}>Toplam</Text>
                  <Text style={s.kriterListeToplamPuan}>100 puan</Text>
                </View>
              </View>
            </ScrollView>
          )}

          {pAdim === 2 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Öğrenci Listesi</Text>
              <Text style={s.adimAlt}>
                Öğrencileri tek tek ekle. Bu liste "{pSinif || 'sınıf'}" için kaydedilir, sonraki seferde otomatik gelir.
              </Text>

              {pRoster.map((r, i) => (
                <View key={i} style={s.ogrenciRow}>
                  <Text style={s.ogrenciSira}>{i + 1}</Text>
                  <TextInput
                    style={[s.input, s.ogrenciNoInput]}
                    value={r.okulNo}
                    onChangeText={v => pRosterGuncelle(i, 'okulNo', v.replace(/[^0-9]/g, ''))}
                    placeholder="No"
                    placeholderTextColor={colors.text3}
                    keyboardType="numeric"
                  />
                  <TextInput
                    style={[s.input, { flex: 1 }]}
                    value={r.adSoyad}
                    onChangeText={v => pRosterGuncelle(i, 'adSoyad', v)}
                    placeholder="Ad Soyad"
                    placeholderTextColor={colors.text3}
                  />
                  <TouchableOpacity onPress={() => pRosterSil(i)} style={s.ogrenciDeleteBtn} activeOpacity={0.7}>
                    <Trash2 size={16} color={colors.text3} strokeWidth={1.5} />
                  </TouchableOpacity>
                </View>
              ))}

              <TouchableOpacity style={s.addBtn} onPress={pRosterEkle} activeOpacity={0.7}>
                <Plus size={16} color={colors.accent} strokeWidth={2} />
                <Text style={s.addBtnText}>Öğrenci Ekle</Text>
              </TouchableOpacity>
            </ScrollView>
          )}

          {pAdim === 3 && (
            <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
              <Text style={s.adimBaslik}>Puanlama</Text>
              <Text style={s.adimAlt}>Tüm sınıf için tek yöntem seç — sonra notları gir</Text>

              <View style={s.segmentedTrack}>
                <TouchableOpacity
                  style={[s.segment, pMod === 'oto' && s.segmentActive]}
                  onPress={() => setPMod('oto')} activeOpacity={0.8}
                >
                  <Text style={[s.segmentText, pMod === 'oto' && s.segmentTextActive]}>Otomatik Dağıt</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.segment, pMod === 'manuel' && s.segmentActive]}
                  onPress={() => setPMod('manuel')} activeOpacity={0.8}
                >
                  <Text style={[s.segmentText, pMod === 'manuel' && s.segmentTextActive]}>Elle Puanla</Text>
                </TouchableOpacity>
              </View>

              {pMod === 'oto' ? (
                <>
                  <TouchableOpacity style={s.tumunuDagitBtn} onPress={pTumunuDagit} activeOpacity={0.85}>
                    <Shuffle size={18} color="#fff" strokeWidth={1.5} />
                    <View style={{ flex: 1 }}>
                      <Text style={s.tumunuDagitText}>Tümünü Dağıt</Text>
                      <Text style={s.tumunuDagitAlt}>Girdiğin notları kriterlere otomatik böler</Text>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={s.kriterRefHead}
                    onPress={() => setPKriterlerAcik(v => !v)}
                    activeOpacity={0.7}
                  >
                    <Text style={s.kriterRefBaslik}>Kriterler</Text>
                    <View style={s.kriterRefSag}>
                      <Text style={s.kriterRefSayi}>{kriterler.length} madde</Text>
                      <ChevronDown size={15} color={colors.text2} strokeWidth={1.5}
                        style={{ transform: [{ rotate: pKriterlerAcik ? '180deg' : '0deg' }] }} />
                    </View>
                  </TouchableOpacity>
                  {pKriterlerAcik && (
                    <View style={s.kriterRefListe}>
                      {kriterler.map((k, ki) => (
                        <View key={ki} style={[s.kriterRefRow, ki === kriterler.length - 1 && s.kriterRefRowSon]}>
                          <Text style={s.kriterRefAd} numberOfLines={2}>{k.ad}</Text>
                          <Text style={s.kriterRefPuan}>{k.puan}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  <View style={s.notCetveliCard}>
                    <View style={s.notCetveliHead}>
                      <Text style={s.notCetveliHeadAd}>ÖĞRENCİ</Text>
                      <Text style={s.notCetveliHeadNot}>ASIL NOT</Text>
                    </View>
                    {pOgrenciler.map((o, i) => {
                      const toplam = o.puanlar.reduce((a, b) => a + b, 0);
                      const acik = pAcikKirilim.has(i);
                      return (
                        <View key={o.no}>
                          <View style={[s.notRow, (acik || i === pOgrenciler.length - 1) && s.notRowSon]}>
                            <View style={s.notRowSol}>
                              <Text style={s.notSira}>{i + 1}</Text>
                              <View style={{ flex: 1 }}>
                                <Text style={s.notAd} numberOfLines={1}>{o.adSoyad}</Text>
                                {o.okulNo ? <Text style={s.notNo}>No {o.okulNo}</Text> : null}
                              </View>
                            </View>
                            <View style={s.notRowSag}>
                              <TextInput
                                ref={r => { pNotInputRefs.current[i] = r; }}
                                style={s.notInput}
                                value={o.asilNot}
                                onChangeText={v => setPOgrenciler(pOgrenciler.map((x, idx) => idx === i ? { ...x, asilNot: v.replace(/[^0-9]/g, '') } : x))}
                                placeholder="85"
                                placeholderTextColor={colors.text3}
                                keyboardType="numeric"
                                maxLength={3}
                                returnKeyType={i < pOgrenciler.length - 1 ? 'next' : 'done'}
                                blurOnSubmit={i === pOgrenciler.length - 1}
                                onBlur={() => pNotCommit(i)}
                                onSubmitEditing={() => pNotInputRefs.current[i + 1]?.focus()}
                              />
                              {toplam > 0 && (
                                <TouchableOpacity style={s.toplamPill} onPress={() => pKirilimAcKapa(i)} activeOpacity={0.7}>
                                  <Text style={s.toplamPillPuan}>{toplam}</Text>
                                  <ChevronDown size={13} color={colors.text2} strokeWidth={1.5}
                                    style={{ transform: [{ rotate: acik ? '180deg' : '0deg' }] }} />
                                </TouchableOpacity>
                              )}
                            </View>
                          </View>
                          {toplam > 0 && acik && (
                            <View style={[s.kirilimBox, i === pOgrenciler.length - 1 && s.notRowSon]}>
                              {kriterler.map((k, ki) => (
                                <View key={ki} style={s.dagilimRow}>
                                  <Text style={s.dagilimAd} numberOfLines={1}>{k.ad}</Text>
                                  <View style={s.dagilimPill}>
                                    <Text style={s.dagilimPuan}>{o.puanlar[ki]}</Text>
                                    <Text style={s.dagilimMax}> / {k.puan}</Text>
                                  </View>
                                </View>
                              ))}
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </>
              ) : (
                pOgrenciler.map((o, i) => {
                  const toplam = o.puanlar.reduce((a, b) => a + b, 0);
                  return (
                    <View key={o.no} style={s.soruCard}>
                      <View style={s.soruHeader}>
                        <Text style={s.soruNo}>{i + 1}. {o.adSoyad}{o.okulNo ? ` (${o.okulNo})` : ''}</Text>
                        <Text style={s.toplamText}>{toplam} / 100</Text>
                      </View>
                      <View style={s.kriterGrid}>
                        {kriterler.map((k, ki) => {
                          const sonKriter = ki === kriterler.length - 1;
                          const sonOgrenci = i === pOgrenciler.length - 1;
                          return (
                          <View key={ki} style={s.kriterInputWrap}>
                            <Text style={s.kriterLabel} numberOfLines={2}>{k.ad}</Text>
                            <TextInput
                              ref={r => {
                                if (!pKriterInputRefs.current[i]) pKriterInputRefs.current[i] = [];
                                pKriterInputRefs.current[i][ki] = r;
                              }}
                              style={s.kriterInput}
                              value={String(o.puanlar[ki] ?? 0)}
                              onChangeText={v => {
                                const n = Math.min(k.puan, Math.max(0, parseInt(v, 10) || 0));
                                setPOgrenciler(pOgrenciler.map((x, idx) => idx === i
                                  ? { ...x, puanlar: x.puanlar.map((p, pi) => pi === ki ? n : p) }
                                  : x));
                              }}
                              keyboardType="numeric"
                              returnKeyType={sonKriter && sonOgrenci ? 'done' : 'next'}
                              blurOnSubmit={sonKriter && sonOgrenci}
                              onSubmitEditing={() => {
                                if (!sonKriter) { pKriterInputRefs.current[i]?.[ki + 1]?.focus(); return; }
                                if (!sonOgrenci) pKriterInputRefs.current[i + 1]?.[0]?.focus();
                              }}
                            />
                            <Text style={s.kriterMax}>/ {k.puan}</Text>
                          </View>
                          );
                        })}
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}
        </KeyboardAvoidingView>

        <View style={s.altBar}>
          {pAdim > 0 ? (
            <TouchableOpacity style={s.geriBtn} onPress={pGeri} activeOpacity={0.7}>
              <ChevronLeft size={18} color={colors.text1} strokeWidth={2} />
              <Text style={s.geriBtnText}>Geri</Text>
            </TouchableOpacity>
          ) : <View />}
          <TouchableOpacity
            style={[s.ileriBtn, pYukleniyor && s.ileriDisabled]}
            onPress={pIleri} activeOpacity={0.8} disabled={pYukleniyor}
          >
            {pAdim === P_ADIMLAR.length - 1 ? (
              <>
                <FileDown size={18} color="#fff" strokeWidth={2} />
                <Text style={s.ileriBtnText}>{pYukleniyor ? 'Oluşturuluyor...' : 'Evrakı Oluştur'}</Text>
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
        await pdfOnizlemeAc(html, false);
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
      await pdfOnizlemeAc(html, false);
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

// ─── Ders seçici ──────────────────────────────────────────────────────────
function DersSecici({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { dersFiltesi } = useOnboarding();

  if (!dersFiltesi || dersFiltesi.length === 0) {
    return (
      <TextInput style={s.input} value={value} onChangeText={onChange}
        placeholder="Ders adı" placeholderTextColor={colors.text3} />
    );
  }

  return (
    <View style={s.chipRow}>
      {dersFiltesi.map(d => (
        <TouchableOpacity key={d} style={[s.chip, value === d && s.chipActive]}
          onPress={() => onChange(d)} activeOpacity={0.7}>
          <Text style={[s.chipText, value === d && s.chipTextActive]}>{d}</Text>
        </TouchableOpacity>
      ))}
    </View>
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
  alanHint: { fontSize: 12.5, fontFamily: fonts.semiBold, color: colors.text2, marginBottom: 6 } as TextStyle,
  input: {
    backgroundColor: colors.bg,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 11,
    fontSize: 15,
    fontFamily: fonts.regular,
    color: colors.text1,
  } as TextStyle,
  textArea: { minHeight: 84, textAlignVertical: 'top', paddingTop: 11, lineHeight: 21 } as TextStyle,

  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' } as ViewStyle,

  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.bg,
  } as ViewStyle,
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent } as ViewStyle,
  chipText: { fontSize: 13, fontFamily: fonts.medium, color: colors.text2 } as TextStyle,
  chipTextActive: { color: '#fff', fontFamily: fonts.semiBold } as TextStyle,

  // Ekran 1 — mantıksal grup başlıkları
  grupBaslik: {
    fontSize: 11, fontFamily: fonts.bold, color: colors.text3, letterSpacing: 0.8,
    marginBottom: spacing.sm, marginTop: 4,
  } as TextStyle,

  // Ekran 2 — yapılandırılmış kriter listesi (ağırlık pill + toplam ayağı)
  kriterListe: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  } as ViewStyle,
  kriterListeHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border,
  } as ViewStyle,
  kriterListeBaslik: { fontSize: 10, fontFamily: fonts.bold, color: colors.text3, letterSpacing: 0.6 } as TextStyle,
  kriterListeSayi: { fontSize: 11, fontFamily: fonts.medium, color: colors.text2 } as TextStyle,
  kriterListeRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  } as ViewStyle,
  kriterListeRowSon: { borderBottomWidth: 0 } as ViewStyle,
  kriterListeAd: { flex: 1, fontSize: 13, fontFamily: fonts.regular, color: colors.text1, marginRight: spacing.sm, lineHeight: 18 } as TextStyle,
  kriterListePill: {
    minWidth: 34, alignItems: 'center', backgroundColor: colors.bg,
    borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border, paddingVertical: 3, paddingHorizontal: 8,
  } as ViewStyle,
  kriterListePuan: { fontSize: 13, fontFamily: fonts.bold, color: colors.accent } as TextStyle,
  kriterListeFooter: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    backgroundColor: colors.bg, borderTopWidth: 1, borderTopColor: colors.border,
  } as ViewStyle,
  kriterListeToplamLabel: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.text1 } as TextStyle,
  kriterListeToplamPuan: { fontSize: 14, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,

  // Ekran 3 — YÖNTEM segmented control
  segmentedTrack: {
    flexDirection: 'row', backgroundColor: colors.bg,
    borderRadius: radius.md, padding: 3, gap: 3,
    borderWidth: 1, borderColor: colors.border,
  } as ViewStyle,
  segment: {
    flex: 1, paddingVertical: 9, borderRadius: radius.sm,
    alignItems: 'center', justifyContent: 'center',
  } as ViewStyle,
  segmentActive: { backgroundColor: colors.accent } as ViewStyle,
  segmentText: { fontSize: 13, fontFamily: fonts.medium, color: colors.text2 } as TextStyle,
  segmentTextActive: { color: '#fff', fontFamily: fonts.semiBold } as TextStyle,

  // Ekran 3 — birincil toplu dağıtım aksiyonu
  tumunuDagitBtn: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    backgroundColor: colors.accent, borderRadius: radius.md,
    paddingVertical: 14, paddingHorizontal: spacing.base,
    marginTop: spacing.base, marginBottom: spacing.base,
  } as ViewStyle,
  tumunuDagitText: { fontSize: 15, fontFamily: fonts.bold, color: '#fff' } as TextStyle,
  tumunuDagitAlt: { fontSize: 12, fontFamily: fonts.regular, color: 'rgba(255,255,255,0.82)', marginTop: 1 } as TextStyle,

  // Ekran 3 (otomatik) — tek "not cetveli" kartı + satırlar
  kriterRefHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, marginBottom: spacing.sm,
  } as ViewStyle,
  kriterRefBaslik: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.text1 } as TextStyle,
  kriterRefSag: { flexDirection: 'row', alignItems: 'center', gap: 6 } as ViewStyle,
  kriterRefSayi: { fontSize: 12, fontFamily: fonts.medium, color: colors.text2 } as TextStyle,
  kriterRefListe: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
    marginBottom: spacing.sm,
  } as ViewStyle,
  kriterRefRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  } as ViewStyle,
  kriterRefRowSon: { borderBottomWidth: 0 } as ViewStyle,
  kriterRefAd: { flex: 1, fontSize: 12.5, fontFamily: fonts.regular, color: colors.text2, marginRight: spacing.sm, lineHeight: 17 } as TextStyle,
  kriterRefPuan: { fontSize: 13, fontFamily: fonts.bold, color: colors.accent } as TextStyle,
  notCetveliCard: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, overflow: 'hidden',
  } as ViewStyle,
  notCetveliHead: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border,
  } as ViewStyle,
  notCetveliHeadAd: { fontSize: 10, fontFamily: fonts.bold, color: colors.text3, letterSpacing: 0.6 } as TextStyle,
  notCetveliHeadNot: { fontSize: 10, fontFamily: fonts.bold, color: colors.text3, letterSpacing: 0.6 } as TextStyle,
  notRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  } as ViewStyle,
  notRowSon: { borderBottomWidth: 0 } as ViewStyle,
  notRowSol: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, flex: 1, marginRight: spacing.sm } as ViewStyle,
  notSira: { width: 20, textAlign: 'center', fontSize: 12, fontFamily: fonts.bold, color: colors.text3 } as TextStyle,
  notAd: { fontSize: 14, fontFamily: fonts.semiBold, color: colors.text1 } as TextStyle,
  notNo: { fontSize: 11, fontFamily: fonts.regular, color: colors.text3, marginTop: 1 } as TextStyle,
  notRowSag: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm } as ViewStyle,
  notInput: {
    width: 58, textAlign: 'center',
    backgroundColor: colors.bg, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border,
    paddingVertical: 8, fontSize: 15, fontFamily: fonts.semiBold, color: colors.text1,
  } as TextStyle,
  toplamPill: {
    flexDirection: 'row', alignItems: 'center', gap: 2,
    backgroundColor: colors.bg, borderRadius: radius.sm,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 8, paddingVertical: 6, minWidth: 46, justifyContent: 'center',
  } as ViewStyle,
  toplamPillPuan: { fontSize: 14, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,
  kirilimBox: {
    paddingLeft: 32, paddingRight: spacing.md, paddingBottom: spacing.xs,
    backgroundColor: colors.bg, borderBottomWidth: 1, borderBottomColor: colors.border,
  } as ViewStyle,
  dagilimRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border,
  } as ViewStyle,
  dagilimAd: { flex: 1, fontSize: 12, fontFamily: fonts.medium, color: colors.text2, marginRight: spacing.sm } as TextStyle,
  dagilimPill: { flexDirection: 'row', alignItems: 'baseline' } as ViewStyle,
  dagilimPuan: { fontSize: 14, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,
  dagilimMax: { fontSize: 11, fontFamily: fonts.regular, color: colors.text3 } as TextStyle,
  kriterOnizleme: {
    fontSize: 11, fontFamily: fonts.regular, color: colors.text2,
    marginTop: 4, marginBottom: spacing.sm,
  } as TextStyle,
  kriterGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: spacing.sm } as ViewStyle,
  kriterInputWrap: { width: '31%' } as ViewStyle,
  kriterLabel: { fontSize: 10, fontFamily: fonts.regular, color: colors.text2, marginBottom: 5, minHeight: 28, lineHeight: 13 } as TextStyle,
  kriterInput: {
    backgroundColor: colors.bg,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.sm,
    paddingVertical: 6, paddingHorizontal: 8, fontSize: 13, fontFamily: fonts.medium,
    color: colors.text1, textAlign: 'center',
  } as TextStyle,
  kriterMax: { fontSize: 10, fontFamily: fonts.regular, color: colors.text3, textAlign: 'center', marginTop: 2 } as TextStyle,
  toplamText: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.text1, marginTop: 4 } as TextStyle,

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
    backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md,
    borderWidth: 1, borderColor: colors.border,
  } as ViewStyle,
  deleteBtn: { padding: 8, marginTop: 4, alignSelf: 'flex-start' } as ViewStyle,
  ogrenciRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    marginBottom: spacing.sm,
  } as ViewStyle,
  ogrenciSira: {
    width: 22, textAlign: 'center',
    fontSize: 13, fontFamily: fonts.semiBold, color: colors.text3,
  } as TextStyle,
  ogrenciNoInput: { width: 64, textAlign: 'center' } as ViewStyle,
  ogrenciDeleteBtn: { padding: 8 } as ViewStyle,
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingVertical: 12, justifyContent: 'center',
    borderRadius: radius.btn, borderWidth: 1, borderColor: colors.accent, borderStyle: 'dashed',
  } as ViewStyle,
  addBtnText: { fontSize: 14, fontFamily: fonts.semiBold, color: colors.accent } as TextStyle,

  gundemItem: { marginBottom: spacing.md } as ViewStyle,
  gundemNo: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.text1, marginBottom: 6 } as TextStyle,

  soruCard: {
    backgroundColor: colors.surface, borderRadius: radius.md,
    padding: spacing.md, marginBottom: spacing.md, gap: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
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
