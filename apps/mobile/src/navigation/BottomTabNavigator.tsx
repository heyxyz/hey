import Ionicons from '@expo/vector-icons/Ionicons';
import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MotiView } from 'moti';
import type { FC } from 'react';
import React, { useCallback } from 'react';
import tailwind from 'twrnc';

import haptic from '../helpers/haptic';
import { useNavigationTheme } from '../hooks/navigation/useNavigationTheme';
import { ExploreStack } from './ExploreStack';
import { HomeStack } from './HomeStack';

const { Navigator, Screen } = createBottomTabNavigator<MainTabParamList>();

type ScreenOptions = (
  params: BottomTabScreenProps
) => BottomTabNavigationOptions;

export const BottomTabNavigator: FC = () => {
  const { tabBarTheme } = useNavigationTheme();

  const screenOptions = useCallback<ScreenOptions>(
    ({ route }) => ({
      tabBarShowLabel: false,
      tabBarStyle: tailwind`bg-black`,
      tabBarIcon: ({
        color,
        size,
        focused
      }: {
        color: string;
        size: number;
        focused: boolean;
      }) => {
        let iconName: keyof typeof Ionicons.glyphMap;

        if (route.name === 'HomeStack') {
          iconName = 'home-outline';
        } else if (route.name === 'ExploreStack') {
          iconName = 'infinite-outline';
        } else {
          iconName = 'globe';
        }

        return (
          <MotiView
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 50 }}
            from={{ opacity: 0.2 }}
          >
            <Ionicons
              name={iconName}
              color={color}
              size={focused ? size + 2 : size}
            />
          </MotiView>
        );
      },
      headerShown: false,
      ...tabBarTheme
    }),
    [tabBarTheme]
  );

  return (
    <Navigator
      screenOptions={screenOptions}
      initialRouteName="HomeStack"
      screenListeners={{
        tabPress: () => haptic()
      }}
    >
      <Screen
        name="HomeStack"
        options={{ title: 'Home' }}
        component={HomeStack}
      />
      <Screen
        name="ExploreStack"
        options={{ title: 'Explore' }}
        component={ExploreStack}
      />
    </Navigator>
  );
};
