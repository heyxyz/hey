import { Card, CardBody } from '@components/UI/Card';
import { FC } from 'react';

const NFTShimmer: FC = () => {
  return (
    <Card>
      <CardBody className="space-y-4 h-52 sm:h-80 shimmer md:rounded-t-[10px]" />
      <div className="p-5 space-y-2 border-t dark:border-gray-700/80">
        <div className="w-7/12 h-3 rounded-lg shimmer" />
        <div className="w-1/3 h-3 rounded-lg shimmer" />
      </div>
    </Card>
  );
};

export default NFTShimmer;
