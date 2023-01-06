import MetaTags from '@components/Common/MetaTags';
import { GridLayout } from '@components/UI/GridLayout';
import { APP_NAME } from 'data/constants';
import type { NextPage } from 'next';

import Colors from './Colors';
import Typography from './Typography';

const Design: NextPage = () => {
  return (
    <GridLayout>
      <MetaTags title={`Design • ${APP_NAME}`} />
      <div className="col-span-12">
        <Typography />
        <div className="divider my-6" />
        <Colors />
        <div className="divider my-6" />
      </div>
    </GridLayout>
  );
};

export default Design;
