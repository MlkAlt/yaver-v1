import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

// Muted earth-tone palette — warm, premium, cohesive with cream bg
const TERRACOTTA = '#B5522A';   // warm burnt sienna
const NAVY       = '#1C2B3A';   // deep ink
const AMBER      = '#C4895A';   // warm amber/sand
const SAGE       = '#7A9B7A';   // muted sage green

const SPRING = { damping: 14, stiffness: 140 };

interface ShapeProps {
  delay: number;
  floatAmt: number;
  floatPeriod: number;
  left: number;
  top: number;
  children: React.ReactNode;
}

function AnimShape({ delay, floatAmt, floatPeriod, left, top, children }: ShapeProps) {
  const opacity = useSharedValue(0);
  const enterY  = useSharedValue(60);
  const floatY  = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, { duration: 350 }));
    enterY.value  = withDelay(delay, withSpring(0, SPRING));

    const tid = setTimeout(() => {
      floatY.value = withRepeat(
        withSequence(
          withTiming(-floatAmt, { duration: floatPeriod }),
          withTiming(0,         { duration: floatPeriod }),
        ),
        -1,
        true,
      );
    }, delay + 750);

    return () => clearTimeout(tid);
  }, []);

  const anim = useAnimatedStyle(() => ({
    opacity:   opacity.value,
    transform: [{ translateY: enterY.value + floatY.value }],
  }));

  return (
    <Animated.View style={[styles.shape, { left, top }, anim]}>
      {children}
    </Animated.View>
  );
}

export function WelcomeAnimation() {
  return (
    <View style={styles.canvas}>
      {/* Terracotta triangle */}
      <AnimShape delay={60} floatAmt={7} floatPeriod={1900} left={85} top={168}>
        <Svg width={110} height={52} viewBox="0 0 110 52">
          <Path d="M55 4 L106 48 L4 48 Z" fill={TERRACOTTA} />
        </Svg>
      </AnimShape>

      {/* Navy rectangle */}
      <AnimShape delay={160} floatAmt={9} floatPeriod={2100} left={60} top={132}>
        <Svg width={160} height={62} viewBox="0 0 160 62">
          <Rect x={0} y={0} width={160} height={62} fill={NAVY} />
        </Svg>
      </AnimShape>

      {/* Amber circle */}
      <AnimShape delay={260} floatAmt={11} floatPeriod={1700} left={116} top={88}>
        <Svg width={48} height={48} viewBox="0 0 48 48">
          <Circle cx={24} cy={24} r={24} fill={AMBER} />
        </Svg>
      </AnimShape>

      {/* Sage diamond (rotated square) */}
      <AnimShape delay={360} floatAmt={8} floatPeriod={2300} left={111} top={42}>
        <Svg width={58} height={58} viewBox="0 0 58 58">
          <Rect
            x={7} y={7}
            width={44} height={44}
            fill={SAGE}
            transform="rotate(45 29 29)"
          />
        </Svg>
      </AnimShape>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: 280,
    height: 250,
  },
  shape: {
    position: 'absolute',
  },
});
