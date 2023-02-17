import clsx from 'clsx';
import type { FC } from 'react';

interface Props {
  showFollow?: boolean;
  isBig?: boolean;
}

const UserProfileShimmer: FC<Props> = ({ showFollow = false, isBig = false }) => {
  return (
    <div className="flex items-center justify-between py-1">
      <div className="flex items-center space-x-3">
        <div className={clsx(isBig ? 'h-14 w-14' : 'h-10 w-10', 'shimmer rounded-full')} />
        <div className="space-y-3">
          <div className="shimmer h-3 w-28 rounded-lg" />
          <div className="shimmer h-3 w-20 rounded-lg" />
          {isBig && <div className="shimmer h-3 w-48 rounded-lg" />}
        </div>
      </div>
      {showFollow && <div className="shimmer h-8 w-10 rounded-lg" />}
    </div>
  );
};

export default UserProfileShimmer;
