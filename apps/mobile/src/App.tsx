import 'react-native-reanimated';
// eslint-disable-next-line import/no-duplicates
import 'react-native-gesture-handler';

import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache
} from '@apollo/client';
import type { FC } from 'react';
import React from 'react';
// eslint-disable-next-line import/no-duplicates
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { AppLoading } from './components/Shared/AppLoading';
import tw from './helpers/tailwind';
import { Navigation } from './navigation';

const httpLink = new HttpLink({
  uri: 'https://api.lens.dev',
  fetchOptions: 'no-cors',
  fetch
});

const apolloClient = new ApolloClient({
  link: from([httpLink]),
  cache: new InMemoryCache()
});

const App: FC = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <AppLoading>
        <GestureHandlerRootView style={tw`flex-1`}>
          <Navigation />
        </GestureHandlerRootView>
      </AppLoading>
    </ApolloProvider>
  );
};

export default App;
