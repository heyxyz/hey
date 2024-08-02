import type { NextPage } from 'next';

import { GridLayout } from '@hey/ui';
import { GridItemTwelve } from '@hey/ui/src/GridLayout';

import Buttons from './Buttons';

const Design: NextPage = () => {
  return (
    <GridLayout>
      <GridItemTwelve className="space-y-5">
        <Buttons />
      </GridItemTwelve>
    </GridLayout>
  );
};

export default Design;
