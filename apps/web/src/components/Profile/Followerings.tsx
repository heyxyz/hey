import type { Profile } from "@hey/lens";
import type { FC } from "react";

import getProfile from "@hey/helpers/getProfile";
import humanize from "@hey/helpers/humanize";
import { H4 } from "@hey/ui";
import Link from "next/link";
import plur from "plur";

interface FolloweringsProps {
  profile: Profile;
}

const Followerings: FC<FolloweringsProps> = ({ profile }) => {
  const profileLink = getProfile(profile).link;
  const { followers, following } = profile.stats;

  return (
    <div className="flex gap-8">
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
        <div className="ld-text-gray-500">{plur("Follower", followers)}</div>
      </Link>
    </div>
  );
};

export default Followerings;
