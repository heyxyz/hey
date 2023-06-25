import type { NavigationState } from '@react-navigation/native';
import { NavigationContainer } from '@react-navigation/native';
import { type FC, useCallback } from 'react';
import React from 'react';

import { StatusBar } from '../components/Shared/StatusBar';
import { useNavigationStatePersistence } from '../hooks/navigation/useNavigationStatePersistence';
import { useNavigationTheme } from '../hooks/navigation/useNavigationTheme';
import { useScreenTracker } from '../hooks/navigation/useScreenTracker';
import { linking } from './linking';
import { RootNavigator } from './RootNavigator';

export const Navigation: FC = () => {
  const {
    navigationRef,
    onReady,
    onStateChange: onStateChangeScreenTracker
  } = useScreenTracker();
  const { navigationTheme } = useNavigationTheme();

  const {
    isReady,
    initialState,
    onStateChange: onStateChangeNavigationStatePersistance
  } = useNavigationStatePersistence();

  const onStateChange = useCallback(
    (state: NavigationState | undefined) => {
      onStateChangeScreenTracker();
      onStateChangeNavigationStatePersistance(state);
    },
    [onStateChangeNavigationStatePersistance, onStateChangeScreenTracker]
  );

  if (!isReady) {
    return null;
  }

  return (
    <>
      <StatusBar />
      <NavigationContainer
        ref={navigationRef}
        onReady={onReady}
        onStateChange={onStateChange}
        theme={navigationTheme}
        linking={linking}
        initialState={initialState}
      >
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};
