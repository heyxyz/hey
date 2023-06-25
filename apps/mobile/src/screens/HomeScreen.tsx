import type { FC } from 'react';
import React from 'react';
import { ScrollView } from 'react-native';

import Timeline from '../components/common/Timeline';

export const HomeScreen: FC = () => {
  return (
    <ScrollView>
      <Timeline />
    </ScrollView>
  );
};
