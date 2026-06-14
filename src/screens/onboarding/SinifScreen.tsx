import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  TouchableOpacity, TextInput, ActivityIndicator, ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check } from 'lucide-react-native';
import { Screen } from '../../components/layout/Screen';
import { HBtn } from '../../components/atoms/HBtn';
import { HProgress } from '../../components/atoms/HProgress';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius } from '../../tokens/spacing';
import { useOnboarding } from '../../context/OnboardingContext';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { supabase } from '../../lib/supabase';
import {
  getGradeRange, hasEkDers,
  getKademeTiles, getGradeRangeForOkulTipi, KademeTile,
} from '../../data/secmeliDersler';

type Props = NativeStackScreenProps<RootStackParamList, 'Sinif'>;

export function SinifScreen({ navigation }: Props) {
  const { brans, bransId, bransSlug, setSiniflar, setOkulTipi } = useOnboarding();
  const [kademeTiles, setKademeTiles] = useState<KademeTile[]>([]);
  const [selectedOkulTipi, setSelectedOkulTipi] = useState<string | null>(null);
  const [allSiniflar, setAllSiniflar] = useState<number[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [hepsi, setHepsi] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bransSlug) {
      const tiles = getKademeTiles(bransSlug);
      setKademeTiles(tiles);
      if (tiles.length > 1) {
        // Sınıf grid'i tile seçilince yüklenir
        setLoading(false);
        return;
      }
      const localGrades = getGradeRange(bransSlug);
      if (localGrades.length > 0) {
        setAllSiniflar(localGrades);
        setLoading(false);
        return;
      }
    }
    // Fallback: DB'den çek (Sınıf Öğretmenliği ve local data'da olmayan branşlar)
    if (!bransSlug) return;
    supabase
      .from('kazanimlar')
      .select('sinif')
      .or(`brans.eq.${bransSlug},branslar.cs.{${bransSlug}}`)
      .then(({ data, error }) => {
        if (!error && data) {
          const unique = [...new Set((data as { sinif: number }[]).map(r => r.sinif))].sort(
            (a, b) => a - b
          );
          setAllSiniflar(unique);
        }
        setLoading(false);
      });
  }, [bransSlug]);

  const handleOkulTipiSelect = (okulTipi: string) => {
    setSelectedOkulTipi(okulTipi);
    setSelected([]);
    setHepsi(false);
    if (bransSlug) setAllSiniflar(getGradeRangeForOkulTipi(bransSlug, okulTipi));
  };

  const toggleSinif = (s: number) => {
    if (hepsi) setHepsi(false);
    setSelected(prev =>
      prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]
    );
  };

  const toggleHepsi = () => {
    const next = !hepsi;
    setHepsi(next);
    setSelected(next ? allSiniflar : []);
  };

  const activeList = hepsi ? allSiniflar : selected;
  const sortedActiveList = [...activeList].sort((a, b) => a - b);
  const canContinue = activeList.length > 0;

  const handleKur = () => {
    if (!canContinue) return;
    setSiniflar(sortedActiveList);
    if (selectedOkulTipi !== null) setOkulTipi(selectedOkulTipi);
    if (brans === 'Sınıf Öğretmenliği') {
      navigation.navigate('EkDersler', { siniflar: sortedActiveList });
    } else if (bransSlug && hasEkDers(bransSlug, sortedActiveList, selectedOkulTipi ?? undefined)) {
      navigation.navigate('Dersler', { siniflar: sortedActiveList });
    } else {
      navigation.navigate('Loading', { brans, bransId, siniflar: sortedActiveList });
    }
  };

  const hepsiSubText = allSiniflar.length > 0
    ? allSiniflar.map(s => `${s}.`).join(', ') + ' sınıf'
    : 'Tüm sınıflar';

  return (
    <Screen bg={colors.bg}>
      <StatusBar style="dark" />

      <HProgress value={50} style={styles.progress} />

      <View style={styles.header}>
        <Text style={styles.step}>Adım 3 / 3</Text>
        <Text style={styles.heading}>
          Hangi sınıflara{'\n'}giriyorsun?
        </Text>
        <Text style={styles.sub}>
          {kademeTiles.length > 1 && selectedOkulTipi === null
            ? 'Önce okul türünü belirle.'
            : 'Birden fazlasını seçebilirsin.'}
        </Text>
      </View>

      {/* Content panel — warm bg, yuvarlak üst köşe */}
      <View style={styles.contentPanel}>
        {loading ? (
          <ActivityIndicator color={colors.accent} style={{ marginTop: spacing.xl }} />
        ) : (
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {/* Okul türü tiles — çok kademeli branşlarda gösterilir */}
            {kademeTiles.length > 1 && (
              <View style={styles.tilesRow}>
                {kademeTiles.map(tile => (
                  <TouchableOpacity
                    key={tile.okulTipi}
                    onPress={() => handleOkulTipiSelect(tile.okulTipi)}
                    activeOpacity={0.75}
                    style={[styles.tile, selectedOkulTipi === tile.okulTipi && styles.tileSelected]}
                  >
                    <Text style={[styles.tileText, selectedOkulTipi === tile.okulTipi && styles.tileTextSelected]}>
                      {tile.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Hepsine giriyorum + grid — tile seçilmeden gösterilmez */}
            {(kademeTiles.length <= 1 || selectedOkulTipi !== null) && (
              <>
            {/* Hepsine giriyorum */}
            <TouchableOpacity
              onPress={toggleHepsi}
              activeOpacity={0.75}
              style={[styles.hepsiCard, hepsi && styles.hepsiSelected]}
            >
              <View style={[styles.hepsiCheck, hepsi && styles.hepsiCheckSelected]}>
                {hepsi && <Check size={12} color="#fff" strokeWidth={3} />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.hepsiTitle}>Hepsine giriyorum</Text>
                <Text style={styles.hepsiSub}>{hepsiSubText}</Text>
              </View>
            </TouchableOpacity>

            {/* Sınıf grid */}
            <View style={styles.grid}>
              {allSiniflar.map((s) => {
                const isSelected = selected.includes(s) || hepsi;
                return (
                  <TouchableOpacity
                    key={s}
                    onPress={() => toggleSinif(s)}
                    activeOpacity={0.75}
                    style={[styles.sinifCard, isSelected && styles.sinifCardSelected]}
                  >
                    {isSelected && (
                      <View style={styles.sinifCheck}>
                        <Check size={10} color="#fff" strokeWidth={3} />
                      </View>
                    )}
                    <Text style={[styles.sinifNum, isSelected && styles.sinifNumSelected]}>
                      {s}.
                    </Text>
                    <Text style={[styles.sinifLabel, isSelected && styles.sinifLabelSelected]}>
                      Sınıf
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
              </>
            )}

            {/* Şube girişi */}
            {activeList.length > 0 && (
              <View style={styles.subeSection}>
                <Text style={styles.subeLabel}>Şubeler — opsiyonel</Text>
                {sortedActiveList.map((s) => (
                  <View key={s} style={styles.subeRow}>
                    <View style={styles.subeBadge}>
                      <Text style={styles.subeBadgeText}>{s}</Text>
                    </View>
                    <TextInput
                      style={styles.subeInput}
                      placeholder={`${s}A, ${s}B, ${s}C...`}
                      placeholderTextColor={colors.text3}
                    />
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>

      {/* Sabit CTA bar */}
      <View style={styles.ctaBar}>
        <HBtn onPress={handleKur} disabled={!canContinue}>
          Yılımı kur →
        </HBtn>
      </View>
    </Screen>
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
    gap: spacing.sm,
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

  sub: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text2,
  } as TextStyle,

  contentPanel: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
  } as ViewStyle,

  scrollContent: {
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.base,
  } as ViewStyle,

  // Okul türü tiles
  tilesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  } as ViewStyle,

  tile: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  } as ViewStyle,

  tileSelected: {
    borderColor: colors.accent,
    backgroundColor: colors.accent,
  } as ViewStyle,

  tileText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text2,
  } as TextStyle,

  tileTextSelected: {
    color: '#FFFFFF',
  } as TextStyle,

  // Hepsine giriyorum
  hepsiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: radius.card,
    padding: spacing.base,
    backgroundColor: colors.surface,
  } as ViewStyle,

  hepsiSelected: {
    borderColor: colors.accent,
    borderWidth: 1.5,
    borderStyle: 'dashed',
    backgroundColor: colors.accentLt,
  } as ViewStyle,

  hepsiCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  hepsiCheckSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  } as ViewStyle,

  hepsiTitle: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text1,
  } as TextStyle,

  hepsiSub: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: colors.text3,
    marginTop: 2,
  } as TextStyle,

  // Sınıf grid
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  } as ViewStyle,

  sinifCard: {
    width: '47.5%',
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 90,
  } as ViewStyle,

  sinifCardSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  } as ViewStyle,

  sinifCheck: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  sinifNum: {
    fontSize: 28,
    fontFamily: fonts.extraBold,
    color: colors.text1,
    letterSpacing: -0.5,
  } as TextStyle,

  sinifNumSelected: {
    color: '#FFFFFF',
  } as TextStyle,

  sinifLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.text2,
  } as TextStyle,

  sinifLabelSelected: {
    color: 'rgba(255,255,255,0.75)',
  } as TextStyle,

  // Şube section
  subeSection: {
    gap: spacing.sm,
  } as ViewStyle,

  subeLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.text2,
    letterSpacing: 0.2,
  } as TextStyle,

  subeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  } as ViewStyle,

  subeBadge: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    paddingVertical: spacing.md,
    borderRightWidth: 1,
    borderRightColor: colors.border,
  } as ViewStyle,

  subeBadgeText: {
    fontSize: 14,
    fontFamily: fonts.semiBold,
    color: colors.text1,
  } as TextStyle,

  subeInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
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
