import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, {
  useSharedValue, useAnimatedStyle, withSpring,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, CalendarDays, BookOpen, FileText } from 'lucide-react-native';
import { colors } from '../../tokens/colors';
import { fonts } from '../../tokens/typography';

const ICONS = [Home, CalendarDays, BookOpen, FileText];
const LABELS = ['Ana Sayfa', 'Planım', 'Ders Hazırla', 'Evraklarım'];

const SPRING = { damping: 14, stiffness: 220 };

interface TabItemProps {
  icon: React.ComponentType<{ size: number; color: string; strokeWidth: number }>;
  label: string;
  isActive: boolean;
  onPress: () => void;
}

function TabItem({ icon: Icon, label, isActive, onPress }: TabItemProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSpring(isActive ? 1.18 : 1, SPRING);
  }, [isActive]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity style={styles.tab} onPress={onPress} activeOpacity={0.75}>
      <Animated.View style={[styles.iconWrap, isActive && styles.iconWrapActive, animStyle]}>
        <Icon
          size={22}
          color={isActive ? colors.accent : colors.text3}
          strokeWidth={isActive ? 2.5 : 1.7}
        />
      </Animated.View>
      <Text style={[styles.label, isActive && styles.labelActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

interface BottomNavProps {
  activeIndex: number;
  onTabPress: (index: number) => void;
}

export function BottomNav({ activeIndex, onTabPress }: BottomNavProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      { paddingBottom: Math.max(insets.bottom, 6), height: 62 + Math.max(insets.bottom, 6) },
    ]}>
      {LABELS.map((label, i) => (
        <TabItem
          key={i}
          icon={ICONS[i]}
          label={label}
          isActive={i === activeIndex}
          onPress={() => onTabPress(i)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    paddingTop: 8,
  } as ViewStyle,
  tab: {
    alignItems: 'center',
    gap: 3,
  } as ViewStyle,
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
  } as ViewStyle,
  iconWrapActive: {
    backgroundColor: colors.accentLt,
  } as ViewStyle,
  label: {
    fontSize: 10,
    fontFamily: fonts.medium,
    color: colors.text3,
    letterSpacing: 0.2,
    textAlign: 'center',
  } as TextStyle,
  labelActive: {
    fontFamily: fonts.bold,
    color: colors.accent,
  } as TextStyle,
});
