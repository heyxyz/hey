import AsyncStorage from '@react-native-async-storage/async-storage';
import type { InitialState, NavigationState } from '@react-navigation/native';
import { getInitialURL } from 'expo-linking';
import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';

const EXPO_LINK_REGEXP = /^exp:\/{2}(?:\d+\.){3}\d+:\d*$/;

const checkInitialURL = (initialUrl: string | null) => {
  return initialUrl == null || initialUrl.match(EXPO_LINK_REGEXP) !== null;
};

type NavigationStatePersistenceReturn = {
  initialState?: InitialState;
  onStateChange: (state: NavigationState | undefined) => void;
  isReady: boolean;
};

const NAVIGATION_STATE = '@navigation/navigation-state';
const isProduction = true;

export const useNavigationStatePersistence =
  (): NavigationStatePersistenceReturn => {
    const [isReady, setIsReady] = useState(isProduction);
    const [initialState, setInitialState] = useState<InitialState>();

    useEffect(() => {
      const restoreState = async () => {
        try {
          const initialUrl = await getInitialURL();

          if (Platform.OS !== 'web' && checkInitialURL(initialUrl)) {
            // Only restore state if there's no deep link and we're not on web
            const savedStateString = await AsyncStorage.getItem(
              NAVIGATION_STATE
            );
            const state = savedStateString
              ? JSON.parse(savedStateString)
              : undefined;

            if (state !== undefined) {
              setInitialState(state);
            }
          }
        } finally {
          setIsReady(true);
        }
      };

      if (!isReady) {
        restoreState();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isReady]);

    const onStateChange = useCallback((state: NavigationState | undefined) => {
      AsyncStorage.setItem(NAVIGATION_STATE, JSON.stringify(state));
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
      initialState,
      onStateChange,
      isReady
    };
  };
