import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, Modal, TextInput, Dimensions,
} from 'react-native';
import {
  FileText, Files, Mail, ChartBar, LayoutGrid, Plus, Search, Download, Trophy, X, ChevronRight, Users,
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
  { id: 'ders-plan',    Icon: LayoutGrid, ad: 'Ders Planı',                iconBg: colors.catOrangeLt, iconColor: colors.catOrange },
  { id: 'diger',        Icon: Plus,       ad: 'Diğer...',                  iconBg: colors.bg,          iconColor: colors.text3     },
];

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

const GECMIS = [
  { id: 'g1', ad: 'Zümre Toplantı Tutanağı', tip: 'Zümre', tarih: '14 Nisan 2025' },
  { id: 'g2', ad: 'Dilekçe — İzin Talebi', tip: 'Dilekçe', tarih: '2 Nisan 2025' },
];

export function EvraklarimScreen() {
  const navigation = useNavigation<Nav>();
  const [kulupSheet, setKulupSheet]           = useState(false);
  const [aylikRaporSheet, setAylikRaporSheet] = useState(false);

  function handleKulupSec(ad: string) {
    setKulupSheet(false);
    navigation.navigate('SablonDoldurma', { sablonId: 'kulup', sablonAdi: ad });
  }

  function handleAylikRaporSec(ad: string) {
    setAylikRaporSheet(false);
    navigation.navigate('SablonDoldurma', { sablonId: 'aylik_rapor', sablonAdi: ad });
  }

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
              onPress={() => s.id === 'sinav-analizi'
                ? navigation.navigate('SinavAnalizi')
                : navigation.navigate('SablonDoldurma', { sablonId: s.id, sablonAdi: s.ad })}
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

        {/* Kulüp Evrakları */}
        <Text style={[styles.sectionLabel, styles.historyLabel]}>KULÜP EVRAKları</Text>
        <TouchableOpacity style={styles.kulupCard} onPress={() => setKulupSheet(true)} activeOpacity={0.8}>
          <View style={styles.kulupIconBox}>
            <Trophy size={22} color={colors.catOrange} strokeWidth={1.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.kulupTitle}>Yıllık Çalışma Planı</Text>
            <Text style={styles.kulupSub}>76 MEB kulübü · EK-7/b formatı · Ekim–Haziran</Text>
          </View>
          <ChevronRight size={16} color={colors.text3} strokeWidth={1.5} />
        </TouchableOpacity>
        <TouchableOpacity style={[styles.kulupCard, { marginTop: 8 }]} onPress={() => setAylikRaporSheet(true)} activeOpacity={0.8}>
          <View style={[styles.kulupIconBox, { backgroundColor: '#EFF6FF' }]}>
            <Trophy size={22} color={colors.accent} strokeWidth={1.5} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.kulupTitle}>Aylık Faaliyet Raporu</Text>
            <Text style={styles.kulupSub}>Kulüp seç · Ay seç · Plan'dan otomatik doldur</Text>
          </View>
          <ChevronRight size={16} color={colors.text3} strokeWidth={1.5} />
        </TouchableOpacity>

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

  kulupCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    gap: spacing.md,
    ...shadows.card,
  } as ViewStyle,
  kulupIconBox: {
    width: 44, height: 44, borderRadius: 12,
    backgroundColor: colors.catOrangeLt,
    alignItems: 'center', justifyContent: 'center',
  } as ViewStyle,
  kulupTitle: { fontSize: 14, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,
  kulupSub: { fontSize: 12, fontFamily: fonts.regular, color: colors.text2, marginTop: 2 } as TextStyle,
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
  emptyText: {
    fontSize: 14, fontFamily: fonts.regular, color: colors.text3,
    textAlign: 'center', marginTop: spacing.xl,
  } as TextStyle,
});
