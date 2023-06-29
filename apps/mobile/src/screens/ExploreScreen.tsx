import type { FC } from 'react';
import React from 'react';
import { ScrollView } from 'react-native';

import Container from '~/components/Shared/Container';
import Timeline from '~/components/Shared/Timeline';

export const ExploreScreen: FC = () => {
  return (
    <Container>
      <ScrollView>
        <Timeline />
      </ScrollView>
    </Container>
  );
};
