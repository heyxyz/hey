import { createStackNavigator } from '@react-navigation/stack';
import type { FC } from 'react';
import React from 'react';

import Header from '../components/common/Header';
import { ExploreScreen } from '../screens/ExploreScreen';

const { Navigator, Screen } = createStackNavigator<ExploreStackParamList>();

export const ExploreStack: FC = () => {
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
            shadowColor: 'transparent',
            elevation: 0
          }
        }}
        component={ExploreScreen}
      />
    </Navigator>
  );
};
