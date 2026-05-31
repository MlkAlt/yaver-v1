import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, Modal, Dimensions,
  StyleSheet as RNStyleSheet,
} from 'react-native';
import {
  BookOpen, Pencil, Zap, ClipboardList,
  MonitorPlay, Notebook, ChevronRight, X,
  FolderOpen, Download,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius, shadows } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { useOnboarding } from '../../context/OnboardingContext';
import { YillikPlan } from '../../lib/planUret';

type Nav = NativeStackNavigationProp<RootStackParamList>;

const SCREEN_H = Dimensions.get('window').height;
const TILE_W = (Dimensions.get('window').width - spacing.base * 2 - 12) / 2;

// --- Tile definitions ---
type TipDef = { id: string; label: string; Icon: React.ComponentType<any>; bg: string; fg: string };
const HIZLI_TIPLER: TipDef[] = [
  { id: 'ders', label: 'Ders Planı', Icon: BookOpen, bg: colors.catBlueLt, fg: colors.catBlue },
  { id: 'sinav', label: 'Sınav', Icon: Pencil, bg: colors.catPurpleLt, fg: colors.catPurple },
  { id: 'etkinlik', label: 'Etkinlik', Icon: Zap, bg: colors.catOrangeLt, fg: colors.catOrange },
  { id: 'yaprak', label: 'Çalışma Yaprağı', Icon: ClipboardList, bg: colors.catGreenLt, fg: colors.catGreen },
  { id: 'slayt', label: 'Slayt', Icon: MonitorPlay, bg: '#FFE8E8', fg: '#C0392B' },
  { id: 'odev', label: 'Ödev', Icon: Notebook, bg: '#FFF8E1', fg: '#E65100' },
];

// --- Filter chips ---
type FilterKey = 'Tümü' | 'Ders Planı' | 'Sınav' | 'Etkinlik' | 'Çalışma Yaprağı' | 'Slayt' | 'Ödev';
const FILTERS: FilterKey[] = ['Tümü', 'Ders Planı', 'Sınav', 'Etkinlik', 'Çalışma Yaprağı', 'Slayt', 'Ödev'];

const TIP_ICON_MAP: Record<string, React.ComponentType<any>> = {
  'Ders Planı': BookOpen, 'Sınav': Pencil,
  'Etkinlik': Zap, 'Çalışma Yaprağı': ClipboardList,
  'Slayt': MonitorPlay, 'Ödev': Notebook,
};
const TIP_COLOR_MAP: Record<string, string> = {
  'Ders Planı': colors.catBlue, 'Sınav': colors.catPurple,
  'Etkinlik': colors.catOrange, 'Çalışma Yaprağı': colors.catGreen,
  'Slayt': '#C0392B', 'Ödev': '#E65100',
};
const TIP_BG_MAP: Record<string, string> = {
  'Ders Planı': colors.catBlueLt, 'Sınav': colors.catPurpleLt,
  'Etkinlik': colors.catOrangeLt, 'Çalışma Yaprağı': colors.catGreenLt,
  'Slayt': '#FFE8E8', 'Ödev': '#FFF8E1',
};

// --- Mock past creations ---
type Creation = { id: string; tip: FilterKey; baslik: string; sinif: string; ozet: string; tarih: string };
const MOCK_CREATIONS: { grup: string; items: Creation[] }[] = [
  {
    grup: 'Bu Hafta',
    items: [
      { id: '1', tip: 'Sınav', baslik: 'Üslü İfadeler — 10 Soru', sinif: '10-A', ozet: 'Çoktan seçmeli · Orta', tarih: 'Bugün' },
      { id: '2', tip: 'Ders Planı', baslik: 'Polinomlar Ders Planı', sinif: '10-A', ozet: '40 dk', tarih: 'Dün' },
    ],
  },
  {
    grup: 'Geçen Hafta',
    items: [
      { id: '3', tip: 'Etkinlik', baslik: 'Trigonometri Etkinliği', sinif: '11-A', ozet: '25 dk · Grup', tarih: '14 Nis' },
      { id: '4', tip: 'Çalışma Yaprağı', baslik: 'Logaritma Çalışma Yaprağı', sinif: '12-C', ozet: '10 alıştırma', tarih: '13 Nis' },
    ],
  },
];

// --- Kazanım picker data ---
type Kazanim = { id: string; kod: string; ad: string; sinif: string };
type HaftaSection = { hafta: number; ayHafta: string; isBuHafta: boolean; isPast: boolean; kazanimlar: Kazanim[] };

const AY_ADLARI = ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'];

function buildHaftaSections(plan: YillikPlan): HaftaSection[] {
  const today = new Date();
  const sections: HaftaSection[] = plan.haftalar
    .filter(h => !h.tatil_mi && h.kazanimlar.length > 0)
    .map(h => {
      const start = new Date(h.baslangic);
      const end = new Date(h.bitis);
      const isBuHafta = today >= start && today <= end;
      const isPast = today > end;
      const ay = AY_ADLARI[start.getMonth()];
      // Ayın kaçıncı haftası (1-4)
      const haftaNoAy = Math.ceil(start.getDate() / 7);
      return {
        hafta: h.hafta_no,
        ayHafta: `${ay} · ${haftaNoAy}. Hafta`,
        isBuHafta,
        isPast,
        kazanimlar: h.kazanimlar.map(k => ({
          id: k.kod,
          kod: k.kod,
          ad: k.ad,
          sinif: `${k.sinif}. Sınıf`,
        })),
      };
    });
  // Sıralama: Bu Hafta > Gelecek (artan) > Geçmiş (azalan)
  const buHafta = sections.filter(s => s.isBuHafta);
  const gelecek = sections.filter(s => !s.isBuHafta && !s.isPast).sort((a, b) => a.hafta - b.hafta);
  const gecmis  = sections.filter(s => s.isPast).sort((a, b) => b.hafta - a.hafta);
  return [...buHafta, ...gelecek, ...gecmis];
}

// ---- Kazanım bottom sheet ----
function KazanimSheet({
  tip,
  sections,
  onClose,
  onSelect,
}: {
  tip: TipDef | null;
  sections: HaftaSection[];
  onClose: () => void;
  onSelect: (kaz: Kazanim) => void;
}) {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={tip !== null}
      onRequestClose={onClose}
    >
      <View style={ss.overlay}>
        {/* Tapping backdrop closes sheet */}
        <TouchableOpacity
          style={RNStyleSheet.absoluteFill}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={ss.sheet}>
          <View style={ss.handle} />

          {/* Header */}
          <View style={ss.sheetHead}>
            <View style={{ flex: 1 }}>
              <Text style={ss.sheetTitle}>Hangi kazanım için?</Text>
              {tip && (
                <View style={[ss.tipBadge, { backgroundColor: tip.bg }]}>
                  <tip.Icon size={13} color={tip.fg} />
                  <Text style={[ss.tipBadgeText, { color: tip.fg }]}>{tip.label}</Text>
                </View>
              )}
            </View>
            <TouchableOpacity style={ss.closeBtn} onPress={onClose}>
              <X size={18} color={colors.text2} strokeWidth={2.5} />
            </TouchableOpacity>
          </View>

          {/* Kazanım list */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 32 }}
          >
            {sections.length === 0 && (
              <Text style={ss.emptyText}>Henüz plan oluşturulmadı.</Text>
            )}
            {sections.map((section, si) => {
              const prevIsPast = si > 0 && !sections[si - 1].isPast;
              return (
                <View key={section.hafta}>
                  {/* "Geçmiş Haftalar" separator */}
                  {section.isPast && prevIsPast && (
                    <View style={ss.pastSep}>
                      <View style={ss.pastLine} />
                      <Text style={ss.pastSepText}>Geçmiş Haftalar</Text>
                      <View style={ss.pastLine} />
                    </View>
                  )}

                  {/* Section header */}
                  <View style={[ss.secHead, section.isBuHafta && ss.secHeadCurrent]}>
                    <Text style={[
                      ss.secLabel,
                      section.isBuHafta && ss.secLabelCurrent,
                      section.isPast && ss.secLabelPast,
                    ]}>
                      {section.isBuHafta ? `Bu Hafta  ·  ${section.ayHafta}` : section.ayHafta}
                    </Text>
                  </View>

                  {/* Kazanımlar */}
                  {section.kazanimlar.map((kaz) => (
                    <TouchableOpacity
                      key={kaz.id}
                      style={[ss.kazRow, section.isPast && ss.kazRowPast]}
                      onPress={() => onSelect(kaz)}
                      activeOpacity={0.7}
                    >
                      <View style={{ flex: 1 }}>
                        <Text style={ss.kazAd} numberOfLines={2}>{kaz.ad}</Text>
                        <Text style={ss.kazMeta}>{kaz.sinif}  ·  {kaz.kod}</Text>
                      </View>
                      <ChevronRight size={15} color={colors.text3} strokeWidth={2.5} />
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// ---- Main screen ----
export function DersIcinScreen() {
  const navigation = useNavigation<Nav>();
  const [filter, setFilter] = useState<FilterKey>('Tümü');
  const [aktivTip, setAktivTip] = useState<TipDef | null>(null);
  const { plan: ctxPlan } = useOnboarding();
  const [plan, setPlan] = useState<YillikPlan | null>(ctxPlan);

  useEffect(() => {
    if (ctxPlan) { setPlan(ctxPlan); return; }
    AsyncStorage.getItem('@yaver/yillik_plan').then(raw => {
      if (raw) try { setPlan(JSON.parse(raw)); } catch {}
    });
  }, [ctxPlan]);

  const kazanimSections = plan ? buildHaftaSections(plan) : [];

  const filtered = MOCK_CREATIONS.map((g) => ({
    ...g,
    items: g.items.filter((item) => filter === 'Tümü' || item.tip === filter),
  })).filter((g) => g.items.length > 0);

  function handleKazanimSec(kaz: Kazanim) {
    const tipId = aktivTip?.id;
    setAktivTip(null);
    navigation.navigate('Uretim', {
      kazanimKodu: kaz.kod,
      kazanimAdi: kaz.ad,
      sinif: kaz.sinif,
      icerikTuru: tipId,
    });
  }

  return (
    <Screen bg={colors.bg}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>

        {/* Başlık */}
        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>Ne hazırlayalım?</Text>
        </View>

        {/* Section label */}
        <Text style={styles.secLabel}>Ne Hazırlayayım?</Text>

        {/* 2×3 Tile grid */}
        <View style={styles.tileGrid}>
          {HIZLI_TIPLER.map((tip) => {
            const { Icon } = tip;
            return (
              <TouchableOpacity
                key={tip.id}
                style={[styles.tile, { backgroundColor: tip.bg }]}
                onPress={() => setAktivTip(tip)}
                activeOpacity={0.8}
              >
                <View style={[styles.tileIconBox, { backgroundColor: tip.fg + '22' }]}>
                  <Icon size={26} color={tip.fg} />
                </View>
                <Text style={[styles.tileLabel, { color: tip.fg }]}>{tip.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Son hazırlananlar */}
        <Text style={[styles.secLabel, { marginTop: spacing.xl + 4 }]}>Son Hazırlananlar</Text>

        {/* Filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterContent}
          style={styles.filterScroll}
        >
          {FILTERS.map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.chip, filter === f && styles.chipActive]}
            >
              <Text style={[styles.chipText, filter === f && styles.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Creation list */}
        {filtered.length === 0 ? (
          <View style={styles.emptyState}>
            <FolderOpen size={44} color={colors.text3} strokeWidth={1} />
            <Text style={styles.emptyTitle}>Henüz hiçbir şey hazırlanmadı.</Text>
            <Text style={styles.emptySub}>Yukarıdan bir materyal türü seç.</Text>
          </View>
        ) : (
          filtered.map((grup) => (
            <View key={grup.grup}>
              <Text style={styles.grupLabel}>{grup.grup}</Text>
              {grup.items.map((item) => {
                const Icon = TIP_ICON_MAP[item.tip] ?? BookOpen;
                const iconColor = TIP_COLOR_MAP[item.tip] ?? colors.text2;
                const iconBg = TIP_BG_MAP[item.tip] ?? colors.bg;
                return (
                  <TouchableOpacity key={item.id} style={styles.card} activeOpacity={0.8}>
                    <View style={[styles.iconBox, { backgroundColor: iconBg }]}>
                      <Icon size={18} color={iconColor} />
                    </View>
                    <View style={styles.cardBody}>
                      <Text style={styles.cardTitle} numberOfLines={1}>{item.baslik}</Text>
                      <Text style={styles.cardMeta}>{item.sinif}  ·  {item.ozet}</Text>
                    </View>
                    <View style={styles.cardRight}>
                      <Text style={styles.cardTarih}>{item.tarih}</Text>
                      <TouchableOpacity style={styles.iconAction}>
                        <Download size={14} color={colors.text2} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>

      <KazanimSheet
        tip={aktivTip}
        sections={kazanimSections}
        onClose={() => setAktivTip(null)}
        onSelect={handleKazanimSec}
      />
    </Screen>
  );
}

// ---- Styles: main screen ----
const styles = StyleSheet.create({
  topBar: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.base,
    paddingBottom: spacing.sm,
  } as ViewStyle,
  pageTitle: { fontSize: 24, fontFamily: fonts.extraBold, color: colors.text1 } as TextStyle,
  pageSub: { fontSize: 13, fontFamily: fonts.medium, color: colors.text2, marginTop: 2 } as TextStyle,

  secLabel: {
    fontSize: 11, fontFamily: fonts.bold, color: colors.text3,
    letterSpacing: 0.8, textTransform: 'uppercase',
    paddingHorizontal: spacing.base, marginBottom: 10, marginTop: spacing.base,
  } as TextStyle,

  tileGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: spacing.base, gap: 12,
  } as ViewStyle,
  tile: {
    width: TILE_W, borderRadius: radius.card,
    padding: spacing.md, gap: spacing.sm,
  } as ViewStyle,
  tileIconBox: {
    width: 44, height: 44, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
  } as ViewStyle,
  tileLabel: { fontSize: 13, fontFamily: fonts.bold } as TextStyle,

  filterScroll: { flexGrow: 0, marginBottom: spacing.sm } as ViewStyle,
  filterContent: {
    paddingHorizontal: spacing.base, gap: spacing.sm,
  } as ViewStyle,
  chip: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: radius.btn, borderWidth: 1.5,
    borderColor: colors.border, backgroundColor: colors.surface,
  } as ViewStyle,
  chipActive: { backgroundColor: colors.text1, borderColor: colors.text1 } as ViewStyle,
  chipText: { fontSize: 13, fontFamily: fonts.semiBold, color: colors.text2 } as TextStyle,
  chipTextActive: { color: '#fff' } as TextStyle,

  grupLabel: {
    fontSize: 11, fontFamily: fonts.bold, color: colors.text3,
    letterSpacing: 0.8, textTransform: 'uppercase',
    marginBottom: spacing.sm, marginTop: spacing.base,
    paddingHorizontal: spacing.base,
  } as TextStyle,

  card: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.card, borderWidth: 1, borderColor: colors.border,
    padding: spacing.md, marginHorizontal: spacing.base,
    marginBottom: spacing.sm, gap: spacing.md,
    ...shadows.card,
  } as ViewStyle,
  iconBox: {
    width: 40, height: 40, borderRadius: radius.icon,
    alignItems: 'center', justifyContent: 'center',
  } as ViewStyle,
  cardBody: { flex: 1, gap: 3 } as ViewStyle,
  cardTitle: { fontSize: 14, fontFamily: fonts.bold, color: colors.text1 } as TextStyle,
  cardMeta: { fontSize: 12, fontFamily: fonts.medium, color: colors.text2 } as TextStyle,
  cardRight: { alignItems: 'flex-end', gap: 6 } as ViewStyle,
  cardTarih: { fontSize: 11, fontFamily: fonts.medium, color: colors.text3 } as TextStyle,
  iconAction: {
    width: 28, height: 28, borderRadius: radius.icon,
    backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center',
  } as ViewStyle,

  emptyState: {
    alignItems: 'center', paddingTop: 40, paddingHorizontal: spacing.xl, gap: spacing.md,
  } as ViewStyle,
  emptyTitle: { fontSize: 16, fontFamily: fonts.bold, color: colors.text1, textAlign: 'center' } as TextStyle,
  emptySub: { fontSize: 13, fontFamily: fonts.medium, color: colors.text2, textAlign: 'center' } as TextStyle,
});

// ---- Styles: bottom sheet ----
const ss = StyleSheet.create({
  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', justifyContent: 'flex-end',
  } as ViewStyle,
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: SCREEN_H * 0.75,
  } as ViewStyle,
  handle: {
    width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border,
    alignSelf: 'center', marginTop: 10, marginBottom: 6,
  } as ViewStyle,
  sheetHead: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingHorizontal: spacing.base, paddingBottom: 12, gap: spacing.sm,
  } as ViewStyle,
  sheetTitle: {
    fontSize: 16, fontFamily: fonts.bold, color: colors.text1, marginBottom: 6,
  } as TextStyle,
  tipBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    alignSelf: 'flex-start', paddingHorizontal: 9, paddingVertical: 4, borderRadius: radius.btn,
  } as ViewStyle,
  tipBadgeText: { fontSize: 12, fontFamily: fonts.bold } as TextStyle,
  closeBtn: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
    marginTop: 2,
  } as ViewStyle,

  secHead: {
    paddingHorizontal: spacing.base, paddingVertical: 8,
    backgroundColor: colors.bg,
  } as ViewStyle,
  secHeadCurrent: { backgroundColor: colors.accentLt } as ViewStyle,
  secLabel: {
    fontSize: 11, fontFamily: fonts.bold, color: colors.text3,
    letterSpacing: 0.7, textTransform: 'uppercase',
  } as TextStyle,
  secLabelCurrent: { color: colors.accent } as TextStyle,
  secLabelPast: { color: colors.text3 } as TextStyle,

  kazRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.base, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.sm,
  } as ViewStyle,
  kazRowPast: { opacity: 0.55 } as ViewStyle,
  kazAd: {
    fontSize: 14, fontFamily: fonts.semiBold, color: colors.text1, lineHeight: 20,
  } as TextStyle,
  kazMeta: { fontSize: 11, fontFamily: fonts.medium, color: colors.text3, marginTop: 2 } as TextStyle,

  pastSep: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.base, paddingVertical: 14, gap: spacing.sm,
  } as ViewStyle,
  pastLine: { flex: 1, height: 1, backgroundColor: colors.border } as ViewStyle,
  pastSepText: {
    fontSize: 10, fontFamily: fonts.bold, color: colors.text3, letterSpacing: 0.5,
    textTransform: 'uppercase',
  } as TextStyle,
  emptyText: {
    fontSize: 14, fontFamily: fonts.regular, color: colors.text3,
    textAlign: 'center', paddingVertical: spacing.xl,
  } as TextStyle,
});
