import * as SplashScreen from 'expo-splash-screen';
import type { FC, PropsWithChildren } from 'react';
import React, { useEffect } from 'react';

import { useCachedResources } from '../../hooks/useCachedResources';

SplashScreen.preventAutoHideAsync();

export const AppLoading: FC<PropsWithChildren> = ({ children }) => {
  const isLoadingComplete = useCachedResources();

  useEffect(() => {
    if (isLoadingComplete !== null) {
      SplashScreen.hideAsync();
    }
  }, [isLoadingComplete]);

  if (!isLoadingComplete) {
    return null;
  }

  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{children}</>;
};
