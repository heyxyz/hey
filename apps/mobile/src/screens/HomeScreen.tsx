import type { FC } from 'react';
import React from 'react';
import { ScrollView } from 'react-native';

import Container from '../components/common/Container';
import Timeline from '../components/common/Timeline';

export const HomeScreen: FC = () => {
  return (
    <Container>
      <ScrollView>
        <Timeline />
      </ScrollView>
    </Container>
  );
};
