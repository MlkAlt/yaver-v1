import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomNav } from './BottomNav';
import { RootStackParamList } from '../../navigation/RootNavigator';
import { TAB_ROUTES } from '../../navigation/tabRoutes';

type Nav = NativeStackNavigationProp<RootStackParamList>;

interface StackBottomNavProps {
  activeIndex: number;
}

export function StackBottomNav({ activeIndex }: StackBottomNavProps) {
  const navigation = useNavigation<Nav>();

  return (
    <BottomNav
      activeIndex={activeIndex}
      onTabPress={(index) => navigation.navigate('MainTabs', { screen: TAB_ROUTES[index] } as never)}
    />
  );
}
