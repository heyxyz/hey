import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import getProfile from '@hey/helpers/getProfile';
import humanize from '@hey/helpers/humanize';
import { H4, H5 } from '@hey/ui';
import Link from 'next/link';
import plur from 'plur';

interface FolloweringsProps {
  profile: Profile;
}

const Followerings: FC<FolloweringsProps> = ({ profile }) => {
  const profileLink = getProfile(profile).link;
  const { followers, following } = profile.stats;

  // Calculate the followers-to-followings ratio
  const ratio = following > 0 ? followers / following : 0;
  const ratioFixed = following > 0 ? ratio.toFixed(2) : 'N/A';

  // Determine the color of the vertical bar based on the ratio
  const getColor = (ratio: number): string => {
    if (ratio >= 1) {
      return 'green';
    }
    if (ratio >= 0.5) {
      return 'yellow';
    }
    if (ratio >= 0.2) {
      return 'orange';
    }
    return 'red';
  };

  return (
    <div className="flex items-center gap-8">
      <div
        style={{
          backgroundColor: getColor(ratio),
          height: '100%',
          marginRight: '10px',
          width: '5px'
        }}
      />
      <Link
        className="text-left outline-offset-4"
        href={`${profileLink}/following`}
      >
        <H4>{humanize(following)}</H4>
        <div className="ld-text-gray-500">Following</div>
      </Link>
      <Link
        className="text-left outline-offset-4"
        href={`${profileLink}/followers`}
      >
        <H4>{humanize(followers)}</H4>
        <div className="ld-text-gray-500">{plur('Follower', followers)}</div>
      </Link>
      <div className="text-center">
        <H5 className="text-lg font-semibold">Ratio: {ratioFixed}</H5>
        <div className="ld-text-gray-500">Followers/Following</div>
      </div>
    </div>
  );
};

export default Followerings;
