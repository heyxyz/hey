import Timeline from '@components/Shared/Timeline';
import type { FC } from 'react';
import React from 'react';
import { ScrollView } from 'react-native';

export const ExploreScreen: FC = () => {
  return (
    <ScrollView>
      <Timeline />
    </ScrollView>
  );
};
