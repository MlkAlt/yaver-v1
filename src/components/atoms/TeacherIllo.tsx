import React, { useEffect } from 'react';
import Svg, { Ellipse, Rect, Path, Line, G } from 'react-native-svg';
import Animated, {
  useSharedValue, useAnimatedStyle, useAnimatedProps,
  withRepeat, withSequence, withTiming, withDelay, Easing,
} from 'react-native-reanimated';

const AnimatedG   = Animated.createAnimatedComponent(G);
const AnimatedPath = Animated.createAnimatedComponent(Path);

const SMOOTH = Easing.inOut(Easing.sin);
const INK    = '#1C1B17';
const BG     = '#EEF0FD'; // matches colors.accentLt (lens holes)
const TEA    = '#C05A28';
const SPOON  = '#C4A24A';

export function TeacherIllo() {
  const floatY    = useSharedValue(0);
  const stirAngle = useSharedValue(0);
  const steam1O   = useSharedValue(0.4);
  const steam2O   = useSharedValue(0.15);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-7, { duration: 2800, easing: SMOOTH }),
        withTiming(7,  { duration: 2800, easing: SMOOTH }),
      ), -1, true,
    );

    stirAngle.value = withRepeat(
      withSequence(
        withTiming(18,  { duration: 680, easing: Easing.inOut(Easing.quad) }),
        withTiming(-18, { duration: 680, easing: Easing.inOut(Easing.quad) }),
      ), -1, true,
    );

    steam1O.value = withRepeat(
      withSequence(
        withTiming(0.05, { duration: 1400, easing: SMOOTH }),
        withTiming(0.55, { duration: 1400, easing: SMOOTH }),
      ), -1, true,
    );

    steam2O.value = withDelay(700, withRepeat(
      withSequence(
        withTiming(0.03, { duration: 1400, easing: SMOOTH }),
        withTiming(0.45, { duration: 1400, easing: SMOOTH }),
      ), -1, true,
    ));
  }, []);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const stirProps = useAnimatedProps(() => ({
    transform: [{ rotation: stirAngle.value, originX: 140, originY: 158 }] as any,
  }));

  const s1Props = useAnimatedProps(() => ({ opacity: steam1O.value }));
  const s2Props = useAnimatedProps(() => ({ opacity: steam2O.value }));

  return (
    <Animated.View style={[{ width: 280, height: 260 }, floatStyle]}>
      <Svg width={280} height={260} viewBox="0 0 280 260">

        {/* ── BUHAR — arkada kalsın ── */}
        <AnimatedPath
          animatedProps={s1Props}
          d="M 130,156 Q 126,143 130,130 Q 134,117 130,105"
          fill="none" stroke="#9B968D" strokeWidth={2.5} strokeLinecap="round"
        />
        <AnimatedPath
          animatedProps={s2Props}
          d="M 150,156 Q 146,143 150,130 Q 154,117 150,105"
          fill="none" stroke="#9B968D" strokeWidth={2.5} strokeLinecap="round"
        />

        {/* ── İNCE BELLİ ÇAY BARDAĞI ── */}
        {/* Dolgu */}
        <Path
          d="M 114,158 Q 128,176 128,190 Q 128,207 123,220 L 157,220 Q 152,207 152,190 Q 152,176 166,158 Z"
          fill={TEA} opacity={0.92}
        />
        {/* Dış çizgi */}
        <Path
          d="M 114,158 Q 128,176 128,190 Q 128,207 123,220 L 157,220 Q 152,207 152,190 Q 152,176 166,158 Z"
          fill="none" stroke={INK} strokeWidth={3}
        />
        {/* Üst ağız */}
        <Line x1={110} y1={158} x2={170} y2={158}
          stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        {/* Alt taban */}
        <Line x1={120} y1={220} x2={160} y2={220}
          stroke={INK} strokeWidth={3.5} strokeLinecap="round" />
        {/* Sol yansıma */}
        <Path
          d="M 120,163 Q 123,176 123,188"
          fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth={2} strokeLinecap="round"
        />

        {/* ── GÖZLÜKLER (kalın çerçeve, siluet) ── */}
        {/* Sol lens dış */}
        <Ellipse cx={97} cy={90} rx={40} ry={28} fill={INK} />
        {/* Sol lens iç (delik) */}
        <Ellipse cx={97} cy={90} rx={27} ry={18} fill={BG} />
        {/* Sağ lens dış */}
        <Ellipse cx={183} cy={90} rx={40} ry={28} fill={INK} />
        {/* Sağ lens iç */}
        <Ellipse cx={183} cy={90} rx={27} ry={18} fill={BG} />
        {/* Köprü */}
        <Rect x={137} y={83} width={6} height={14} rx={3} fill={INK} />
        {/* Sol kol */}
        <Path d="M 57,90 Q 44,94 34,90" stroke={INK} strokeWidth={6.5} strokeLinecap="round" fill="none" />
        {/* Sağ kol */}
        <Path d="M 223,90 Q 236,94 246,90" stroke={INK} strokeWidth={6.5} strokeLinecap="round" fill="none" />

        {/* ── BIIYIK ── */}
        <Path
          d="M 108,140 C 110,128 122,128 130,140 C 133,145 137,146 140,146 C 143,146 147,145 150,140 C 158,128 170,128 172,140 C 168,150 158,150 152,143 C 148,139 144,141 140,141 C 136,141 132,139 128,143 C 122,150 112,150 108,140 Z"
          fill={INK}
        />

        {/* ── KAŞIK (dönen) ── */}
        <AnimatedG animatedProps={stirProps}>
          <Ellipse cx={140} cy={154} rx={5.5} ry={3.5} fill={SPOON} />
          <Line x1={140} y1={157} x2={140} y2={214}
            stroke={SPOON} strokeWidth={3.5} strokeLinecap="round" />
        </AnimatedG>

      </Svg>
    </Animated.View>
  );
}
