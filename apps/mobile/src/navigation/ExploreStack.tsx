import { createStackNavigator } from '@react-navigation/stack';
import type { FC } from 'react';
import React from 'react';

import Header from '~/components/Shared/Header';
import { ExploreScreen } from '~/screens/ExploreScreen';
import useMobileStore from '~/store/useMobileStore';

const { Navigator, Screen } = createStackNavigator<ExploreStackParamList>();

export const ExploreStack: FC = () => {
  const homeGradientColor = useMobileStore((state) => state.homeGradientColor);

  return (
    <Navigator>
      <Screen
        name="Explore"
        options={{
          title: 'Explore',
          headerTitle: (props) => <Header {...props} />,
          headerShadowVisible: false,
          animationEnabled: true,
          headerStyle: {
            backgroundColor: homeGradientColor,
            shadowColor: 'transparent',
            elevation: 0
          }
        }}
        component={ExploreScreen}
      />
    </Navigator>
  );
};
