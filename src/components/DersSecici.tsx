import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../tokens/colors';
import { fonts } from '../tokens/typography';
import { spacing, radius } from '../tokens/spacing';
import { useOnboarding } from '../context/OnboardingContext';

// Onboarding'de birden fazla ders seçilmişse (dersFiltesi) chip listesi
// gösterir; context boşsa (uygulama yeniden açılmışsa, OnboardingContext
// persist edilmiyor) veya tek/hiç ders yoksa serbest metin kutusuna düşer.
export function DersSecici({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { dersFiltesi } = useOnboarding();

  if (!dersFiltesi || dersFiltesi.length === 0) {
    return (
      <TextInput style={st.input} value={value} onChangeText={onChange}
        placeholder="Ders adı" placeholderTextColor={colors.text3} />
    );
  }

  return (
    <View style={st.chipRow}>
      {dersFiltesi.map(d => (
        <TouchableOpacity key={d} style={[st.chip, value === d && st.chipActive]}
          onPress={() => onChange(d)} activeOpacity={0.7}>
          <Text style={[st.chipText, value === d && st.chipTextActive]}>{d}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const st = StyleSheet.create({
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
  chipRow: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' } as ViewStyle,
  chip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.bg,
  } as ViewStyle,
  chipActive: { backgroundColor: colors.accent, borderColor: colors.accent } as ViewStyle,
  chipText: { fontSize: 13, fontFamily: fonts.medium, color: colors.text2 } as TextStyle,
  chipTextActive: { color: '#fff', fontFamily: fonts.semiBold } as TextStyle,
});
