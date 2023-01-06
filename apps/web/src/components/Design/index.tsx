import { GridItemEight, GridLayout } from '@components/UI/GridLayout';
import type { NextPage } from 'next';

import Typography from './Typography';

const Design: NextPage = () => {
  return (
    <GridLayout>
      <GridItemEight>
        <Typography />
      </GridItemEight>
    </GridLayout>
  );
};

export default Design;
