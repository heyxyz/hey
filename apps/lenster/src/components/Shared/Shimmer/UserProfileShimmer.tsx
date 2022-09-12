import clsx from 'clsx';
import { FC } from 'react';

interface Props {
  showFollow?: boolean;
  isBig?: boolean;
}

const UserProfileShimmer: FC<Props> = ({ showFollow = false, isBig = false }) => {
  return (
    <div className="flex justify-between items-center py-1">
      <div className="flex items-center space-x-3">
        <div className={clsx(isBig ? 'w-14 h-14' : 'w-10 h-10', 'rounded-full shimmer')} />
        <div className="space-y-3">
          <div className="w-28 h-3 rounded-lg shimmer" />
          <div className="w-20 h-3 rounded-lg shimmer" />
          {isBig && <div className="w-48 h-3 rounded-lg shimmer" />}
        </div>
      </div>
      {showFollow && <div className="w-10 h-8 rounded-lg shimmer" />}
    </div>
  );
};

export default UserProfileShimmer;
