import { TextStyle } from 'react-native';

type TypographyStyle = Pick<TextStyle, 'fontSize' | 'fontWeight' | 'letterSpacing' | 'lineHeight'>;

export const typography: Record<string, TypographyStyle> = {
  display:   { fontSize: 30, fontWeight: '800', letterSpacing: -0.5, lineHeight: 36 },
  h1:        { fontSize: 24, fontWeight: '800', letterSpacing: -0.3, lineHeight: 30 },
  h2:        { fontSize: 20, fontWeight: '700', letterSpacing: -0.2, lineHeight: 26 },
  h3:        { fontSize: 16, fontWeight: '700', letterSpacing: -0.1, lineHeight: 22 },
  body:      { fontSize: 15, fontWeight: '500', lineHeight: 22 },
  bodySmall: { fontSize: 13, fontWeight: '500', lineHeight: 18 },
  label:     { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  caption:   { fontSize: 12, fontWeight: '500', lineHeight: 16 },
};

export const fonts = {
  regular:   'PlusJakartaSans_400Regular',
  medium:    'PlusJakartaSans_500Medium',
  semiBold:  'PlusJakartaSans_600SemiBold',
  bold:      'PlusJakartaSans_700Bold',
  extraBold: 'PlusJakartaSans_800ExtraBold',
  italic:    'PlusJakartaSans_400Regular_Italic',
};
