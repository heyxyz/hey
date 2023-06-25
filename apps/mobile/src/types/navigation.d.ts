import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type {
  CompositeScreenProps,
  NavigatorScreenParams
} from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

type RootStackComposite<
  S extends keyof RootStackParamList = keyof RootStackParamList
> = CompositeScreenProps<
  StackScreenProps<RootStackParamList, S>,
  BottomTabScreenProps<MainTabParamList>
>;

type HomeStackComposite<S extends keyof HomeStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<HomeStackParamList, S>,
      BottomTabScreenProps<MainTabParamList, 'HomeStack'>
    >,
    StackScreenProps<RootStackParamList, 'MainTab'>
  >;

type ExploreStackComposite<S extends keyof ExploreStackParamList> =
  CompositeScreenProps<
    CompositeScreenProps<
      StackScreenProps<ExploreStackParamList, S>,
      BottomTabScreenProps<MainTabParamList, 'ExploreStack'>
    >,
    StackScreenProps<RootStackParamList, 'MainTab'>
  >;

declare global {
  // PARAMS
  type HomeStackParamList = {
    Home: undefined;
    Details: { id: string };
  };

  type ExploreStackParamList = {
    Explore: undefined;
  };

  type MainTabParamList = {
    HomeStack: NavigatorScreenParams<HomeStackParamList>;
    ExploreStack: NavigatorScreenParams<ExploreStackParamList>;
  };

  type RootStackParamList = {
    // unauthorized
    SignUp: undefined;
    SignIn: undefined;

    // authorized
    MainTab: NavigatorScreenParams<MainTabParamList>;
    Settings: undefined;

    // modals
    ApplicationInfo: undefined;
    NotFound: undefined;
  };

  namespace ReactNavigation {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface RootParamList extends RootStackParamList {}
  }

  // SCREENS - specific screens props
  // You can get navigation or route prop for every screen f. eg.
  // - HomeScreenNavigationProps['route']
  // - HomeScreenNavigationProps['navigation']

  type BottomTabScreenProps = BaseBottomTabScreenProps<
    MainTabParamList,
    'HomeStack' | 'ExploreStack'
  >;

  // Root stack
  type RootStackScreenProps = RootStackComposite;

  // Home stack
  type HomeScreenProps = HomeStackComposite<'Home'>;
  type ExploreScreenProps = ExploreStackComposite<'Explore'>;
}
