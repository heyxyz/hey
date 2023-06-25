import type { NavigationContainerRefWithCurrent } from '@react-navigation/core';
import { createNavigationContainerRef } from '@react-navigation/native';
import { useCallback, useRef } from 'react';

export const navigationRef = createNavigationContainerRef();

type Callback = (currentRouteName: string) => Promise<void> | undefined;

const defaultCallback: Callback = async (currentRouteName) => {
  console.log(`Current route: ${currentRouteName}`);
};

type ScreenTrackerReturn = {
  navigationRef: NavigationContainerRefWithCurrent<ReactNavigation.RootParamList>;
  onReady: () => void;
  onStateChange: () => Promise<void>;
};

export const useScreenTracker = (
  callback = defaultCallback
): ScreenTrackerReturn => {
  const routeNameRef = useRef<string>();

  const onReady = useCallback(() => {
    routeNameRef.current = navigationRef?.getCurrentRoute()?.name;
  }, []);

  const onStateChange = useCallback(async () => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = navigationRef?.getCurrentRoute()?.name;

    if (previousRouteName !== currentRouteName && currentRouteName) {
      await callback(currentRouteName);
    }

    routeNameRef.current = currentRouteName;
  }, [callback]);

  return { navigationRef, onReady, onStateChange };
};
