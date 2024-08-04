import type { NextPage } from 'next';

import { GridLayout } from '@hey/ui';
import { GridItemTwelve } from '@hey/ui/src/GridLayout';

import Buttons from './Buttons';
import Profiles from './Profiles';
import Typography from './Typography';

const Design: NextPage = () => {
  return (
    <GridLayout>
      <GridItemTwelve className="space-y-5">
        <Typography />
        <Buttons />
        <Profiles />
      </GridItemTwelve>
    </GridLayout>
  );
};

export default Design;
