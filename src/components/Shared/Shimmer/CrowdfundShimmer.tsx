import { GridItemSix, GridLayout } from '@components/GridLayout';
import { Card, CardBody } from '@components/UI/Card';
import { FC } from 'react';

const CrowdfundShimmer: FC = () => {
  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="space-y-4">
          <div className="w-1/4 h-4 rounded-lg shimmer" />
          <div className="space-y-2">
            <div className="w-7/12 h-3 rounded-lg shimmer" />
            <div className="w-1/3 h-3 rounded-lg shimmer" />
          </div>
        </div>
        <div className="w-full h-[13px] !my-5 rounded-full shimmer" />
        <GridLayout className="!p-0 mt-5">
          <GridItemSix className="space-y-3">
            <div className="w-1/3 h-3 rounded-lg shimmer" />
            <div className="w-16 h-5 rounded-md shimmer" />
          </GridItemSix>
          <GridItemSix className="space-y-3">
            <div className="w-1/3 h-3 rounded-lg shimmer" />
            <div className="w-16 h-5 rounded-md shimmer" />
          </GridItemSix>
        </GridLayout>
      </CardBody>
    </Card>
  );
};

export default CrowdfundShimmer;
