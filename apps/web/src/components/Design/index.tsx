import { GridLayout } from '@components/UI/GridLayout';
import type { NextPage } from 'next';

import Colors from './Colors';
import Typography from './Typography';

const Design: NextPage = () => {
  return (
    <GridLayout>
      <div className="col-span-12">
        <Typography />
        <div className="divider my-5" />
        <Colors />
      </div>
    </GridLayout>
  );
};

export default Design;
