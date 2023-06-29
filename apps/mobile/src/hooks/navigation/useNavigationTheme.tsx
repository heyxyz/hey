import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import type { Theme } from '@react-navigation/native';
import { useMemo } from 'react';

import { navigationTheme } from '~/constants/theme';

type ReturnValues = {
  navigationTheme: Theme;
  tabBarTheme: BottomTabNavigationOptions;
};

export const useNavigationTheme = (): ReturnValues => {
  const tabBarTheme: BottomTabNavigationOptions = useMemo(
    () => ({
      tabBarActiveTintColor: '#ffffff',
      tabBarInactiveTintColor: '#ffffff50'
    }),
    []
  );

  return {
    navigationTheme,
    tabBarTheme
  };
};
