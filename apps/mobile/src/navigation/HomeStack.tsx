import { createStackNavigator } from '@react-navigation/stack';
import type { FC } from 'react';
import React from 'react';

import Header from '../components/common/Header';
import { HomeScreen } from '../screens';

const { Navigator, Screen } = createStackNavigator<HomeStackParamList>();

export const HomeStack: FC = () => {
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
            shadowColor: 'transparent',
            elevation: 0
          }
        }}
        component={HomeScreen}
      />
    </Navigator>
  );
};
