import 'react-native-reanimated';
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler';

import { ApolloProvider, appClient } from '@lenster/lens/apollo';
import type { FC } from 'react';
import React from 'react';
// eslint-disable-next-line import/no-duplicates
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppLoading } from './components/Shared/AppLoading';
import tw from './lib/tailwind';
import { Navigation } from './navigation';

const App: FC = () => {
  return (
    <ApolloProvider client={appClient}>
      <AppLoading>
        <GestureHandlerRootView style={tw`flex-1`}>
          <Navigation />
        </GestureHandlerRootView>
      </AppLoading>
    </ApolloProvider>
  );
};

export default App;
