import React, { useState, useEffect, useCallback, memo } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  TextInput, Pressable, FlatList, ActivityIndicator, Keyboard,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import {
  Calculator, Zap, FlaskConical, Leaf, Landmark, Map,
  BookOpen, Globe, Brain, BookMarked, Music, Palette,
  Activity, Monitor, Languages, Scale, GraduationCap, Search, Check,
} from 'lucide-react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { HBtn } from '../../components/atoms/HBtn';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { HProgress } from '../../components/atoms/HProgress';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { supabase } from '../../lib/supabase';

type Props = NativeStackScreenProps<RootStackParamList, 'Brans'>;

interface Brans {
  id: string;
  ad: string;
  renk: string;
  kademe: string[] | null;
  slug: string | null;
}

type IconComponent = React.ComponentType<{ size: number; color: string; strokeWidth?: number }>;

function getBransIcon(ad: string): IconComponent {
  const n = ad.toLowerCase();
  if (n.includes('matematik'))                            return Calculator;
  if (n.includes('fizik'))                                return Zap;
  if (n.includes('kimya'))                                return FlaskConical;
  if (n.includes('biyoloji'))                             return Leaf;
  if (n.includes('tarih') || n.includes('inkılap'))       return Landmark;
  if (n.includes('coğrafya'))                             return Map;
  if (n.includes('türk dili') || n.includes('tde'))       return BookOpen;
  if (n.includes('ingilizce') || n.includes('İngilizce')) return Globe;
  if (n.includes('felsefe'))                              return Brain;
  if (n.includes('din'))                                  return BookMarked;
  if (n.includes('müzik'))                                return Music;
  if (n.includes('görsel') || n.includes('sanat'))        return Palette;
  if (n.includes('beden'))                                return Activity;
  if (n.includes('bilişim'))                              return Monitor;
  if (n.includes('almanca') || n.includes('arapça'))      return Languages;
  if (n.includes('insan hakları'))                        return Scale;
  if (n.includes('sınıf öğretmen'))                       return GraduationCap;
  return BookOpen;
}

function getBransColors(ad: string): { iconBg: string; iconColor: string } {
  const n = ad.toLowerCase();
  const c = colors;
  if (n.includes('matematik') || n.includes('fizik') || n.includes('almanca') || n.includes('arapça'))
    return { iconBg: c.catBlueLt, iconColor: c.catBlue };
  if (n.includes('türk') || n.includes('tde') || n.includes('felsefe') || n.includes('edebiyat'))
    return { iconBg: c.catPurpleLt, iconColor: c.catPurple };
  if (n.includes('fen') || n.includes('biyoloji'))
    return { iconBg: c.catGreenLt, iconColor: c.catGreen };
  if (n.includes('kimya') || n.includes('beden'))
    return { iconBg: c.catOrangeLt, iconColor: c.catOrange };
  if (n.includes('tarih') || n.includes('inkılap') || n.includes('din') || n.includes('sınıf öğretmen'))
    return { iconBg: c.catAmberLt, iconColor: c.catAmber };
  if (n.includes('coğrafya') || n.includes('bilişim'))
    return { iconBg: c.catTealLt, iconColor: c.catTeal };
  if (n.includes('ingilizce') || n.includes('İngilizce') || n.includes('insan hakları'))
    return { iconBg: c.catRedLt, iconColor: c.catRed };
  if (n.includes('müzik') || n.includes('sanat') || n.includes('görsel'))
    return { iconBg: c.catPinkLt, iconColor: c.catPink };
  return { iconBg: c.accentLt, iconColor: c.accent };
}

interface BransCardProps {
  brans: Brans;
  isSelected: boolean;
  onPress: (b: Brans) => void;
}

const BransCard = memo(function BransCard({ brans: b, isSelected, onPress }: BransCardProps) {
  const Icon = getBransIcon(b.ad);
  const { iconBg, iconColor } = getBransColors(b.ad);
  return (
    <Pressable
      onPress={() => onPress(b)}
      style={({ pressed }) => [
        styles.card,
        isSelected && styles.cardSelected,
        pressed && { opacity: 0.8 },
      ]}
    >
      {isSelected && (
        <View style={styles.selectedDot}>
          <Check size={9} color="#FFFFFF" strokeWidth={3} />
        </View>
      )}
      <View style={[
        styles.iconBox,
        { backgroundColor: isSelected ? 'rgba(255,255,255,0.22)' : iconBg },
      ]}>
        <Icon size={20} color={isSelected ? '#FFFFFF' : iconColor} strokeWidth={2} />
      </View>
      <Text
        style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}
        numberOfLines={2}
      >
        {b.ad}
      </Text>
    </Pressable>
  );
});

export function BransScreen({ navigation }: Props) {
  const { setBrans, setBransId, setBransSlug, setOkulTipi, setSeciliDersler, setDersFiltesi } = useOnboarding();
  const [selected, setSelected] = useState<Brans | null>(null);
  const [search, setSearch]     = useState('');
  const [branslar, setBranslar] = useState<Brans[]>([]);
  const [loading, setLoading]   = useState(true);
  const [hata, setHata]         = useState<string | null>(null);

  const fetchBranslar = () => {
    setLoading(true);
    setHata(null);
    supabase
      .from('branslar')
      .select('id, ad, renk, slug')
      .order('sira')
      .then(({ data, error }) => {
        if (error) {
          setHata(error.message || JSON.stringify(error));
        } else if (data) {
          setBranslar(data as Brans[]);
        }
        setLoading(false);
      });
  };

  useEffect(() => { fetchBranslar(); }, []);

  const filtered = branslar.filter(b =>
    b.ad.toLowerCase().includes(search.toLowerCase())
  );

  const handleCardPress = useCallback((b: Brans) => {
    Keyboard.dismiss();
    setSelected(b);
  }, []);

  const handleDevam = () => {
    if (!selected) return;
    setBrans(selected.ad);
    setBransId(selected.id);
    setBransSlug(selected.slug ?? '');
    const kademe = selected.kademe ?? [];
    if (kademe.length === 1) setOkulTipi(kademe[0]);
    else setOkulTipi('');
    setSeciliDersler([]);
    setDersFiltesi(undefined);
    navigation.navigate('Sinif');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Screen bg={colors.bg}>
        <StatusBar style="dark" />

        <HProgress value={25} style={styles.progress} />

        <View style={styles.header}>
          <Text style={styles.step}>Adım 1 / 3</Text>
          <Text style={styles.heading}>
            Hangi branşı{'\n'}öğretiyorsun?
          </Text>
          <Text style={styles.context}>
            Branşına göre müfredatını otomatik kuruyoruz.
          </Text>
          <View style={styles.searchBox}>
            <Search size={16} color={colors.text3} strokeWidth={1.5} />
            <TextInput
              style={styles.searchInput}
              placeholder="Branş ara..."
              placeholderTextColor={colors.text3}
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>

        {/* Grid panel — warm bg, yuvarlak üst köşe */}
        <View style={styles.gridPanel}>
          {loading ? (
            <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
          ) : hata ? (
            <View style={{ alignItems: 'center', marginTop: spacing.xl, paddingHorizontal: spacing.xl }}>
              <Text style={[styles.emptyText, { color: '#c0392b', marginBottom: spacing.md }]}>
                Bağlantı hatası:{'\n'}{hata}
              </Text>
              <Pressable onPress={fetchBranslar} style={{ backgroundColor: colors.accent, paddingHorizontal: 24, paddingVertical: 10, borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontFamily: fonts.semiBold, fontSize: 14 }}>Tekrar dene</Text>
              </Pressable>
            </View>
          ) : (
            <FlatList
              data={filtered}
              keyExtractor={b => b.id}
              numColumns={3}
              contentContainerStyle={styles.gridContent}
              columnWrapperStyle={styles.row}
              renderItem={({ item: b }) => (
                <BransCard
                  brans={b}
                  isSelected={selected?.id === b.id}
                  onPress={handleCardPress}
                />
              )}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Branş bulunamadı.</Text>
              }
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            />
          )}
        </View>

        {/* Sabit CTA bar */}
        <View style={styles.ctaBar}>
          <HBtn onPress={handleDevam} disabled={!selected}>
            Devam →
          </HBtn>
        </View>
      </Screen>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  progress: {
    borderRadius: 0,
  } as ViewStyle,

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.md,
  } as ViewStyle,

  step: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.text3,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  } as TextStyle,

  heading: {
    fontSize: 30,
    fontFamily: fonts.extraBold,
    color: colors.text1,
    lineHeight: 36,
    letterSpacing: -0.5,
  } as TextStyle,

  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.base,
    paddingVertical: 12,
  } as ViewStyle,

  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.text1,
    padding: 0,
  } as TextStyle,

  gridPanel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  } as ViewStyle,

  gridContent: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.md,
  } as ViewStyle,

  row: {
    gap: 8,
    marginBottom: 8,
  } as ViewStyle,

  card: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: spacing.sm,
    minHeight: 96,
    position: 'relative',
  } as ViewStyle,

  cardSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  } as ViewStyle,

  selectedDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(255,255,255,0.28)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  cardLabel: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.text1,
    textAlign: 'center',
    lineHeight: 15,
  } as TextStyle,

  cardLabelSelected: {
    color: '#FFFFFF',
  } as TextStyle,

  context: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text2,
    lineHeight: 20,
    marginTop: -spacing.xs,
  } as TextStyle,

  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text3,
    marginTop: spacing.xl,
  } as TextStyle,

  ctaBar: {
    backgroundColor: colors.bg,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.sm,
    paddingBottom: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  } as ViewStyle,
});
