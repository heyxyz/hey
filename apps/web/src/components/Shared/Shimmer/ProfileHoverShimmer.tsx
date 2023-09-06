import type { FC } from 'react';

interface ProfileHoverShimmerProps {
  handle: string;
}

const ProfileHoverShimmer: FC<ProfileHoverShimmerProps> = ({ handle }) => {
  return (
    <div className="flex p-3">
      <div>{handle}</div>
    </div>
  );
};

export default ProfileHoverShimmer;
