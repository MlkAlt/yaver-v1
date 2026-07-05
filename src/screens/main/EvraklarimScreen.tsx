import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, Modal, TextInput, Dimensions,
} from 'react-native';
import {
  FileText, Files, Mail, ChartBar, LayoutGrid, Plus, Search, Download, Trophy, X, ChevronRight, Users, Award, ClipboardList,
} from 'lucide-react-native';
import KULUPLER from '../../../kulupler/kulupler.json';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius, shadows } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Nav = NativeStackNavigationProp<RootStackParamList>;

type IconComp = React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;

type Sablon = {
  id: string;
  Icon: IconComp;
  ad: string;
  yeni?: boolean;
  iconBg: string;
  iconColor: string;
};

const SABLONLAR: Sablon[] = [
  { id: 'zumre',        Icon: FileText,   ad: 'Zümre Tutanağı', yeni: true, iconBg: colors.catBlueLt,   iconColor: colors.catBlue   },
  { id: 'sok',          Icon: Files,      ad: 'ŞÖK Belgesi',               iconBg: colors.catTealLt,   iconColor: colors.catTeal   },
  { id: 'veli',         Icon: Users,      ad: 'Veli Toplantısı', yeni: true, iconBg: colors.catGreenLt, iconColor: colors.catGreen  },
  { id: 'dilekce',      Icon: Mail,       ad: 'Dilekçe',        yeni: true, iconBg: colors.catPurpleLt, iconColor: colors.catPurple },
  { id: 'sinav-analizi',Icon: ChartBar,   ad: 'Sınav Analizi',             iconBg: colors.catGreenLt,  iconColor: colors.catGreen  },
  { id: 'performans',   Icon: Award,      ad: 'Performans Notu', yeni: true, iconBg: colors.catAmberLt, iconColor: colors.catAmber },
  { id: 'ders-plan',    Icon: LayoutGrid, ad: 'Ders Planı',                iconBg: colors.catOrangeLt, iconColor: colors.catOrange },
  { id: 'kulup-evrak',  Icon: Trophy,     ad: 'Kulüp Evrakları', yeni: true, iconBg: colors.catRedLt,   iconColor: colors.catRed    },
  { id: 'rehberlik-evrak', Icon: ClipboardList, ad: 'Rehberlik Evrakları', yeni: true, iconBg: colors.catTealLt, iconColor: colors.catTeal },
  { id: 'diger',        Icon: Plus,       ad: 'Diğer...',                  iconBg: colors.bg,          iconColor: colors.text3     },
];

type KategoriKalem = { id: string; Icon: IconComp; ad: string; iconBg: string; iconColor: string; onPress: () => void };

const SHEET_H = Dimensions.get('window').height * 0.8;

function KulupSheet({
  visible, onClose, onSelect,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (ad: string) => void;
}) {
  const [query, setQuery] = useState('');
  const filtered = (KULUPLER as string[]).filter(k =>
    k.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={ss.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject as any} onPress={onClose} activeOpacity={1} />
        <View style={ss.sheet}>
          <View style={ss.handle} />
          <Text style={ss.sheetTitle}>Kulübünü Seç</Text>

          {/* Arama */}
          <View style={ss.searchRow}>
            <Search size={15} color={colors.text3} strokeWidth={1.5} />
            <TextInput
              style={ss.searchInput}
              placeholder="Kulüp ara..."
              placeholderTextColor={colors.text3}
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')}>
                <X size={14} color={colors.text3} strokeWidth={2} />
              </TouchableOpacity>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            {filtered.length === 0 ? (
              <Text style={ss.emptyText}>Kulüp bulunamadı.</Text>
            ) : (
              filtered.map(k => (
                <TouchableOpacity key={k} style={ss.row} onPress={() => onSelect(k)} activeOpacity={0.7}>
                  <Text style={ss.rowText}>{k}</Text>
                  <ChevronRight size={14} color={colors.text3} strokeWidth={2} />
                </TouchableOpacity>
              ))
            )}
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function KategoriSheet({
  visible, baslik, kalemler, onClose, onSelect,
}: {
  visible: boolean;
  baslik: string;
  kalemler: KategoriKalem[];
  onClose: () => void;
  onSelect: (kalem: KategoriKalem) => void;
}) {
  return (
    <Modal transparent animationType="slide" visible={visible} onRequestClose={onClose}>
      <View style={ss.overlay}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject as any} onPress={onClose} activeOpacity={1} />
        <View style={ss.sheet}>
          <View style={ss.handle} />
          <Text style={ss.sheetTitle}>{baslik}</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {kalemler.map(k => (
              <TouchableOpacity key={k.id} style={ss.kategoriRow} onPress={() => onSelect(k)} activeOpacity={0.7}>
                <View style={[ss.kategoriIcon, { backgroundColor: k.iconBg }]}>
                  <k.Icon size={18} color={k.iconColor} strokeWidth={1.5} />
                </View>
                <Text style={ss.kategoriRowText}>{k.ad}</Text>
                <ChevronRight size={16} color={colors.text3} strokeWidth={1.5} />
              </TouchableOpacity>
            ))}
            <View style={{ height: 32 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const GECMIS = [
  { id: 'g1', ad: 'Zümre Toplantı Tutanağı', tip: 'Zümre', tarih: '14 Nisan 2025' },
  { id: 'g2', ad: 'Dilekçe — İzin Talebi', tip: 'Dilekçe', tarih: '2 Nisan 2025' },
];

export function EvraklarimScreen() {
  const navigation = useNavigation<Nav>();
  const [kulupSheet, setKulupSheet]           = useState(false);
  const [aylikRaporSheet, setAylikRaporSheet] = useState(false);
  const [toplumHizmetSheet, setToplumHizmetSheet] = useState(false);
  const [yoklamaSheet, setYoklamaSheet]       = useState(false);
  const [kategoriSheet, setKategoriSheet]     = useState<'kulup' | 'rehberlik' | null>(null);

  function handleKulupSec(ad: string) {
    setKulupSheet(false);
    navigation.navigate('SablonDoldurma', { sablonId: 'kulup', sablonAdi: ad });
  }

  function handleAylikRaporSec(ad: string) {
    setAylikRaporSheet(false);
    navigation.navigate('SablonDoldurma', { sablonId: 'aylik_rapor', sablonAdi: ad });
  }

  function handleToplumHizmetSec(ad: string) {
    setToplumHizmetSheet(false);
    navigation.navigate('SablonDoldurma', { sablonId: 'toplum_hizmet', sablonAdi: ad });
  }

  function handleYoklamaSec(ad: string) {
    setYoklamaSheet(false);
    navigation.navigate('SablonDoldurma', { sablonId: 'yoklama_karar', sablonAdi: ad });
  }

  const KULUP_EVRAK: KategoriKalem[] = [
    { id: 'kulup_yillik',  Icon: Trophy, ad: 'Yıllık Çalışma Planı',         iconBg: colors.catOrangeLt, iconColor: colors.catOrange, onPress: () => setKulupSheet(true) },
    { id: 'kulup_aylik',   Icon: Trophy, ad: 'Aylık Faaliyet Raporu',        iconBg: colors.catBlueLt,   iconColor: colors.catBlue,   onPress: () => setAylikRaporSheet(true) },
    { id: 'kulup_toplum',  Icon: Trophy, ad: 'Toplum Hizmeti Planı',         iconBg: colors.catGreenLt,  iconColor: colors.catGreen,  onPress: () => setToplumHizmetSheet(true) },
    { id: 'kulup_yoklama', Icon: Users,  ad: 'Yoklama ve Karar Defteri',     iconBg: colors.catRedLt,    iconColor: colors.catRed,    onPress: () => setYoklamaSheet(true) },
  ];

  const REHBERLIK_EVRAK: KategoriKalem[] = [
    { id: 'rehberlik_aylik',  Icon: ClipboardList, ad: 'Aylık Rehberlik Raporu', iconBg: colors.catPurpleLt, iconColor: colors.catPurple, onPress: () => navigation.navigate('SablonDoldurma', { sablonId: 'rehberlik_aylik', sablonAdi: 'Aylık Rehberlik Raporu' }) },
    { id: 'donem_sonu',       Icon: ClipboardList, ad: 'Dönem Sonu Raporu',       iconBg: colors.catTealLt,   iconColor: colors.catTeal,   onPress: () => navigation.navigate('SablonDoldurma', { sablonId: 'donem_sonu', sablonAdi: 'Dönem Sonu Raporu' }) },
    { id: 'rehberlik_yillik', Icon: ClipboardList, ad: 'Yıllık Rehberlik Planı',  iconBg: colors.catGreenLt,  iconColor: colors.catGreen,  onPress: () => navigation.navigate('SablonDoldurma', { sablonId: 'rehberlik_yillik', sablonAdi: 'Yıllık Rehberlik Planı' }) },
  ];

  return (
    <Screen bg={colors.bg}>
      <View style={styles.topBar}>
        <Text style={styles.pageTitle}>Evraklarım</Text>
        <View style={styles.searchBtn}><Search size={18} color={colors.text2} strokeWidth={1.5} /></View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>HAZIR ŞABLONLAR</Text>
        <View style={styles.grid}>
          {SABLONLAR.map((s) => (
            <TouchableOpacity
              key={s.id}
              style={styles.sablonCard}
              activeOpacity={0.8}
              onPress={() => {
                if (s.id === 'sinav-analizi') { navigation.navigate('SinavAnalizi'); return; }
                if (s.id === 'kulup-evrak') { setKategoriSheet('kulup'); return; }
                if (s.id === 'rehberlik-evrak') { setKategoriSheet('rehberlik'); return; }
                navigation.navigate('SablonDoldurma', { sablonId: s.id, sablonAdi: s.ad });
              }}
            >
              {s.yeni ? (
                <View style={styles.newBadge}><Text style={styles.newBadgeText}>YENİ</Text></View>
              ) : null}
              <View style={[styles.sablonIconBox, { backgroundColor: s.iconBg }]}>
                <s.Icon size={20} color={s.iconColor} strokeWidth={1.5} />
              </View>
              <Text style={styles.sablonAd} numberOfLines={2}>{s.ad}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={[styles.sectionLabel, styles.historyLabel]}>GEÇMİŞ EVRAKLAR</Text>
        {GECMIS.map((b) => (
          <View key={b.id} style={styles.gecmisCard}>
            <View style={styles.gecmisTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.gecmisAd} numberOfLines={1}>{b.ad}</Text>
                <Text style={styles.gecmisTarih}>{b.tarih}</Text>
              </View>
              <View style={styles.gecmisTipBadge}>
                <Text style={styles.gecmisTipText}>{b.tip}</Text>
              </View>
            </View>
            <View style={styles.gecmisActions}>
              <TouchableOpacity style={styles.gecmisActionBtn}>
                <Text style={styles.gecmisActionText}>Görüntüle</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.gecmisActionBtn, styles.gecmisActionBtnRow]}>
                <Download size={12} color={colors.accent} strokeWidth={1.5} />
                <Text style={styles.gecmisActionText}>İndir</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Zümre toplantısı yaklaşıyor mu?</Text>
          <Text style={styles.tipSub}>İlk evrak için yukarıdan şablon seç</Text>
        </View>
      </ScrollView>

      <KulupSheet
        visible={kulupSheet}
        onClose={() => setKulupSheet(false)}
        onSelect={handleKulupSec}
      />
      <KulupSheet
        visible={aylikRaporSheet}
        onClose={() => setAylikRaporSheet(false)}
        onSelect={handleAylikRaporSec}
      />
      <KulupSheet
        visible={toplumHizmetSheet}
        onClose={() => setToplumHizmetSheet(false)}
        onSelect={handleToplumHizmetSec}
      />
      <KulupSheet
        visible={yoklamaSheet}
        onClose={() => setYoklamaSheet(false)}
        onSelect={handleYoklamaSec}
      />

      <KategoriSheet
        visible={kategoriSheet !== null}
        baslik={kategoriSheet === 'kulup' ? 'Kulüp Evrakları' : 'Rehberlik Evrakları'}
        kalemler={kategoriSheet === 'kulup' ? KULUP_EVRAK : REHBERLIK_EVRAK}
        onClose={() => setKategoriSheet(null)}
        onSelect={(kalem) => { setKategoriSheet(null); kalem.onPress(); }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  pageTitle: { fontSize: 24, fontFamily: fonts.extraBold, color: colors.text1 } as TextStyle,
  searchBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  scroll: { paddingHorizontal: spacing.base, paddingTop: spacing.sm, paddingBottom: 90 } as ViewStyle,
  sectionLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: spacing.md,
  } as TextStyle,
  historyLabel: { marginTop: spacing.xl } as TextStyle,

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  } as ViewStyle,
  sablonCard: {
    width: '48%',
    minHeight: 100,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    ...shadows.card,
  } as ViewStyle,
  sablonIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  newBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.accent,
    borderRadius: radius.btn,
    paddingHorizontal: 7,
    paddingVertical: 2,
  } as ViewStyle,
  newBadgeText: { fontSize: 9, fontFamily: fonts.bold, color: '#fff' } as TextStyle,
  sablonAd: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.text1, textAlign: 'center' } as TextStyle,

  gecmisCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
    ...shadows.card,
  } as ViewStyle,
  gecmisTop: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.sm } as ViewStyle,
  gecmisAd: { fontSize: 14, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,
  gecmisTarih: { fontSize: 12, fontFamily: fonts.regular, color: colors.text3, marginTop: 2 } as TextStyle,
  gecmisTipBadge: {
    backgroundColor: colors.accentLt,
    borderRadius: radius.btn,
    paddingHorizontal: 10,
    paddingVertical: 4,
  } as ViewStyle,
  gecmisTipText: { fontSize: 11, fontFamily: fonts.medium, color: colors.accent } as TextStyle,
  gecmisActions: { flexDirection: 'row', gap: spacing.sm } as ViewStyle,
  gecmisActionBtn: {
    flex: 1,
    borderRadius: radius.btn,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 9,
    alignItems: 'center',
  } as ViewStyle,
  gecmisActionBtnRow: { flexDirection: 'row', gap: 5, justifyContent: 'center' } as ViewStyle,
  gecmisActionText: { fontSize: 13, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,

  tipCard: {
    marginTop: spacing.sm,
    backgroundColor: colors.bg,
    borderRadius: radius.md,
    padding: spacing.base,
    alignItems: 'center',
    gap: 3,
  } as ViewStyle,
  tipTitle: { fontSize: 14, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,
  tipSub: { fontSize: 12, fontFamily: fonts.regular, color: colors.text3 } as TextStyle,
});

// ---- Bottom sheet styles ----
const ss = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', justifyContent: 'flex-end',
  } as ViewStyle,
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: SHEET_H,
    paddingBottom: 0,
  } as ViewStyle,
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border,
    alignSelf: 'center', marginTop: 10, marginBottom: 6,
  } as ViewStyle,
  sheetTitle: {
    fontSize: 16, fontFamily: fonts.bold, color: colors.text1,
    paddingHorizontal: spacing.base, paddingBottom: spacing.sm,
  } as TextStyle,
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.base, marginBottom: spacing.sm,
    backgroundColor: colors.bg, borderRadius: radius.btn,
    paddingHorizontal: spacing.md, paddingVertical: 10, gap: spacing.sm,
  } as ViewStyle,
  searchInput: {
    flex: 1, fontSize: 14, fontFamily: fonts.regular, color: colors.text1,
    padding: 0,
  } as TextStyle,
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.base, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  } as ViewStyle,
  rowText: { flex: 1, fontSize: 14, fontFamily: fonts.medium, color: colors.text1 } as TextStyle,
  kategoriRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.md,
    marginHorizontal: spacing.base, paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  } as ViewStyle,
  kategoriIcon: {
    width: 40, height: 40, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  } as ViewStyle,
  kategoriRowText: { flex: 1, fontSize: 15, fontFamily: fonts.semiBold, color: colors.text1 } as TextStyle,
  emptyText: {
    fontSize: 14, fontFamily: fonts.regular, color: colors.text3,
    textAlign: 'center', marginTop: spacing.xl,
  } as TextStyle,
});
