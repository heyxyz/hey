import type { LinkingOptions } from '@react-navigation/native';
import Constants from 'expo-constants';
import { createURL } from 'expo-linking';

const prefix = createURL('/', { scheme: '/' });
const universalLinks = Constants.manifest?.extra?.universalLinks ?? [];

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [prefix, ...universalLinks],
  config: {
    initialRouteName: 'MainTab',
    screens: {
      Settings: 'settings',
      MainTab: {
        screens: {
          HomeStack: {
            screens: { Home: '', Details: '/details/:id' }
          },
          ExploreStack: {
            screens: { Audio: 'explore' }
          }
        }
      },
      SignIn: 'sign-in',
      SignUp: 'sign-up',
      NotFound: '*'
    }
  }
};
