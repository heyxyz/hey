import type { FC } from 'react';

interface ProfileHoverShimmerProps {
  handle: string;
}

const ProfileHoverShimmer: FC<ProfileHoverShimmerProps> = ({ handle }) => {
  return (
    <div className="flex p-3 pt-1.5">
      <div>{handle}</div>
    </div>
  );
};

export default ProfileHoverShimmer;
