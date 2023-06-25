import { createStackNavigator } from '@react-navigation/stack';
import type { FC } from 'react';
import React from 'react';

import Header from '~/components/Shared/Header';
import { HomeScreen } from '~/screens/HomeScreen';
import useMobileStore from '~/store/useMobileStore';

const { Navigator, Screen } = createStackNavigator<HomeStackParamList>();

export const HomeStack: FC = () => {
  const homeGradientColor = useMobileStore((state) => state.homeGradientColor);

  return (
    <Navigator>
      <Screen
        name="Home"
        options={{
          title: 'Home',
          headerTitle: (props) => <Header {...props} />,
          headerShadowVisible: false,
          animationEnabled: true,
          headerStyle: {
            backgroundColor: homeGradientColor,
            shadowColor: 'transparent',
            elevation: 0
          }
        }}
        component={HomeScreen}
      />
    </Navigator>
  );
};
