import type { StatusBarProps } from 'expo-status-bar';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import type { FC } from 'react';
import React from 'react';

export const StatusBar: FC = (props: StatusBarProps) => {
  return (
    <ExpoStatusBar
      animated
      hideTransitionAnimation="fade"
      translucent
      style="light"
      {...props}
    />
  );
};
