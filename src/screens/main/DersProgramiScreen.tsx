import React, { useState, useMemo } from 'react';
import {
  View, Text, StyleSheet, ViewStyle, TextStyle,
  ScrollView, TouchableOpacity, Modal, Pressable, Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '../../components/layout/Screen';
import { AppBar } from '../../components/layout/AppBar';
import { useOnboarding } from '../../context/OnboardingContext';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';
import { spacing, radius, shadows } from '../../tokens/spacing';
import { RootStackParamList } from '../../navigation/RootNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'DersProgrami'>;

const GUNLER = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum'];
const GUN_TAMAMI = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma'];
const SAAT_SAYISI = 8;
const SUBELER = ['A', 'B', 'C'];

type Program = Record<string, Record<number, string | null>>;

function buildInitialProgram(): Program {
  const p: Program = {};
  GUNLER.forEach((g) => {
    p[g] = {};
    for (let s = 1; s <= SAAT_SAYISI; s++) p[g][s] = null;
  });
  return p;
}

function buildSinifSecenekleri(siniflar: number[]): string[] {
  if (siniflar.length === 0) {
    return ['9-A', '9-B', '10-A', '10-B', '11-A', '11-B'];
  }
  return siniflar.flatMap((s) => SUBELER.map((sube) => `${s}-${sube}`));
}

const { width: SCREEN_W } = Dimensions.get('window');
const LABEL_W = 36;
const CELL_W = Math.floor((SCREEN_W - spacing.base * 2 - LABEL_W - 4) / 5);
const CELL_H = 44;

export function DersProgramiScreen({ navigation, route }: Props) {
  const fromOnboarding = route.params?.fromOnboarding ?? false;
  const { siniflar } = useOnboarding();
  const [program, setProgram] = useState<Program>(buildInitialProgram);
  const [picker, setPicker] = useState<{ gun: string; saat: number } | null>(null);

  const secenekler = useMemo(() => buildSinifSecenekleri(siniflar), [siniflar]);

  function handleSelect(sinif: string | null) {
    if (!picker) return;
    setProgram((prev) => ({
      ...prev,
      [picker.gun]: { ...prev[picker.gun], [picker.saat]: sinif },
    }));
    setPicker(null);
  }

  function handleSave() {
    // TODO: AsyncStorage'a kaydet
    if (fromOnboarding) {
      navigation.replace('MainTabs');
    } else {
      navigation.goBack();
    }
  }

  function handleSkip() {
    navigation.replace('MainTabs');
  }

  const pickerGunTam = picker ? GUN_TAMAMI[GUNLER.indexOf(picker.gun)] : '';

  return (
    <Screen bg={colors.bg}>
      <AppBar
        title={fromOnboarding ? 'Son Adım' : 'Ders Programım'}
        back={!fromOnboarding}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {fromOnboarding && (
          <View style={styles.onboardingHint}>
            <Text style={styles.onboardingTitle}>Ders programını ekle</Text>
            <Text style={styles.onboardingSubtitle}>
              Yaver yarınki derslerin için seni hatırlatsın. İstersen daha sonra da ekleyebilirsin.
            </Text>
          </View>
        )}
        {!fromOnboarding && (
          <Text style={styles.hint}>
            Hangi gün, hangi saatte hangi sınıfa girdiğini seç.
          </Text>
        )}

        {/* Grid */}
        <View style={styles.gridWrapper}>
          {/* Gün başlıkları */}
          <View style={styles.headerRow}>
            <View style={{ width: LABEL_W }} />
            {GUNLER.map((g) => (
              <View key={g} style={[styles.headerCell, { width: CELL_W }]}>
                <Text style={styles.headerText}>{g}</Text>
              </View>
            ))}
          </View>

          {/* Saat satırları */}
          {Array.from({ length: SAAT_SAYISI }, (_, i) => i + 1).map((saat) => (
            <View key={saat} style={styles.row}>
              <View style={[styles.saatLabel, { width: LABEL_W }]}>
                <Text style={styles.saatText}>{saat}.</Text>
              </View>
              {GUNLER.map((gun) => {
                const deger = program[gun][saat];
                const dolu = !!deger;
                return (
                  <TouchableOpacity
                    key={gun}
                    style={[
                      styles.cell,
                      { width: CELL_W, height: CELL_H },
                      dolu && styles.cellDolu,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setPicker({ gun, saat })}
                  >
                    {dolu ? (
                      <Text style={styles.cellText} numberOfLines={1}>{deger}</Text>
                    ) : (
                      <Text style={styles.cellEmpty}>·</Text>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.85} onPress={handleSave}>
          <Text style={styles.saveBtnText}>{fromOnboarding ? 'Kaydet ve başla →' : 'Kaydet'}</Text>
        </TouchableOpacity>

        {fromOnboarding && (
          <TouchableOpacity style={styles.skipBtn} activeOpacity={0.6} onPress={handleSkip}>
            <Text style={styles.skipBtnText}>Şimdi değil, atla</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* Picker Modal */}
      <Modal
        visible={!!picker}
        transparent
        animationType="slide"
        onRequestClose={() => setPicker(null)}
      >
        <Pressable style={styles.overlay} onPress={() => setPicker(null)}>
          <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
            {picker && (
              <>
                <View style={styles.sheetHandle} />
                <Text style={styles.sheetTitle}>
                  {pickerGunTam} · {picker.saat}. Saat
                </Text>

                <View style={styles.chipRow}>
                  {secenekler.map((s) => {
                    const aktif = program[picker.gun][picker.saat] === s;
                    return (
                      <TouchableOpacity
                        key={s}
                        style={[styles.chip, aktif && styles.chipAktif]}
                        activeOpacity={0.75}
                        onPress={() => handleSelect(s)}
                      >
                        <Text style={[styles.chipText, aktif && styles.chipTextAktif]}>
                          {s}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  style={styles.bosBtn}
                  activeOpacity={0.7}
                  onPress={() => handleSelect(null)}
                >
                  <Text style={styles.bosBtnText}>Boş bırak</Text>
                </TouchableOpacity>
              </>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: spacing.base,
    gap: spacing.md,
  } as ViewStyle,

  onboardingHint: {
    gap: spacing.sm,
    marginBottom: spacing.sm,
  } as ViewStyle,

  onboardingTitle: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.text1,
    letterSpacing: -0.4,
  } as TextStyle,

  onboardingSubtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.text2,
    lineHeight: 20,
  } as TextStyle,

  hint: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text2,
    lineHeight: 20,
  } as TextStyle,

  gridWrapper: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.card,
  } as ViewStyle,

  headerRow: {
    flexDirection: 'row',
    backgroundColor: colors.bg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
    paddingLeft: 4,
  } as ViewStyle,

  headerCell: {
    alignItems: 'center',
  } as ViewStyle,

  headerText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.text2,
    letterSpacing: 0.3,
  } as TextStyle,

  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingLeft: 4,
    alignItems: 'center',
  } as ViewStyle,

  saatLabel: {
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,

  saatText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.text3,
  } as TextStyle,

  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  } as ViewStyle,

  cellDolu: {
    backgroundColor: colors.accentLt,
  } as ViewStyle,

  cellText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.accent,
    textAlign: 'center',
  } as TextStyle,

  cellEmpty: {
    fontSize: 18,
    color: colors.border,
    lineHeight: 22,
  } as TextStyle,

  saveBtn: {
    backgroundColor: colors.accent,
    borderRadius: radius.btn,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: spacing.sm,
    ...shadows.cardMd,
  } as ViewStyle,

  saveBtnText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: '#fff',
  } as TextStyle,

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  } as ViewStyle,

  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.card,
    borderTopRightRadius: radius.card,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.md,
    paddingBottom: 36,
    gap: spacing.md,
  } as ViewStyle,

  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: spacing.sm,
  } as ViewStyle,

  sheetTitle: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: colors.text1,
    textAlign: 'center',
  } as TextStyle,

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  } as ViewStyle,

  chip: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: radius.btn,
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
  } as ViewStyle,

  chipAktif: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  } as ViewStyle,

  chipText: {
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.text1,
  } as TextStyle,

  chipTextAktif: {
    color: '#fff',
  } as TextStyle,

  bosBtn: {
    alignItems: 'center',
    paddingVertical: 10,
  } as ViewStyle,

  bosBtnText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text3,
  } as TextStyle,

  skipBtn: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  } as ViewStyle,

  skipBtnText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.text3,
  } as TextStyle,
});
