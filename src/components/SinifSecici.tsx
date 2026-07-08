import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { colors } from '../tokens/colors';
import { fonts } from '../tokens/typography';
import { spacing, radius } from '../tokens/spacing';
import { useOnboarding } from '../context/OnboardingContext';
import { sinifLabel } from '../lib/sinifLabel';

export function parseSinifDegeri(v: string): [number | null, string] {
  const m = v.match(/^(\d+)\s*\/?\s*([A-Za-z]*)$/);
  if (!m) return [null, ''];
  return [Number(m[1]), m[2].toUpperCase()];
}

export function SinifSecici({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { siniflar } = useOnboarding();
  const [acik, setAcik] = useState(false);

  if (siniflar.length === 0) {
    return (
      <TextInput style={st.input} value={value} onChangeText={onChange}
        placeholder="örn. 10/A" placeholderTextColor={colors.text3} />
    );
  }

  const [sinifNo, sube] = parseSinifDegeri(value);
  const setSinifNo = (n: number) => { onChange(sube ? `${n}/${sube}` : `${n}`); setAcik(false); };
  const setSube = (t: string) => onChange(sinifNo != null ? `${sinifNo}/${t}` : t);

  return (
    <View style={st.sinifSubeRow}>
      <TouchableOpacity style={st.sinifDropdown} onPress={() => setAcik(true)} activeOpacity={0.7}>
        <Text style={[st.sinifDropdownText, sinifNo == null && { color: colors.text3 }]}>
          {sinifNo != null ? sinifLabel(sinifNo) : 'Sınıf seç'}
        </Text>
        <ChevronDown size={16} color={colors.text3} strokeWidth={2} />
      </TouchableOpacity>
      <Text style={st.sinifSubeAyrac}>/</Text>
      <TextInput style={[st.input, { flex: 1 }]} value={sube}
        onChangeText={t => setSube(t.toUpperCase())}
        placeholder="Şube (A)" placeholderTextColor={colors.text3}
        maxLength={2} autoCapitalize="characters" />

      <Modal transparent animationType="fade" visible={acik} onRequestClose={() => setAcik(false)}>
        <TouchableOpacity style={st.sinifModalOverlay} activeOpacity={1} onPress={() => setAcik(false)}>
          <View style={st.sinifModalCard}>
            <Text style={st.sinifModalTitle}>Sınıf seç</Text>
            <View style={st.chipRow}>
              {siniflar.map(n => (
                <TouchableOpacity key={n} style={[st.chip, sinifNo === n && st.chipActive]}
                  onPress={() => setSinifNo(n)} activeOpacity={0.7}>
                  <Text style={[st.chipText, sinifNo === n && st.chipTextActive]}>{sinifLabel(n)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  sinifSubeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 } as ViewStyle,
  sinifDropdown: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 6,
    backgroundColor: colors.bg, borderRadius: radius.sm, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: 11, minWidth: 100,
  } as ViewStyle,
  sinifDropdownText: { fontSize: 15, fontFamily: fonts.medium, color: colors.text1 } as TextStyle,
  sinifSubeAyrac: { fontSize: 16, fontFamily: fonts.medium, color: colors.text3 } as TextStyle,
  sinifModalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.42)', justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: spacing.xl,
  } as ViewStyle,
  sinifModalCard: {
    backgroundColor: colors.surface, borderRadius: 20, padding: spacing.lg, width: '100%',
  } as ViewStyle,
  sinifModalTitle: { fontSize: 16, fontFamily: fonts.bold, color: colors.text1, marginBottom: spacing.md } as TextStyle,
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
