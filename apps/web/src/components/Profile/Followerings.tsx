import Following from "@components/Shared/Modal/Following";
import getProfile from "@hey/helpers/getProfile";
import humanize from "@hey/helpers/humanize";
import type { Profile } from "@hey/lens";
import { H4, Modal } from "@hey/ui";
import Link from "next/link";
import plur from "plur";
import { type FC, useState } from "react";

interface FolloweringsProps {
  profile: Profile;
}

const Followerings: FC<FolloweringsProps> = ({ profile }) => {
  const [showFollowingModal, setShowFollowingModal] = useState(false);

  const profileLink = getProfile(profile).link;
  const { followers, following } = profile.stats;

  return (
    <div className="flex gap-8">
      <button
        onClick={() => setShowFollowingModal(true)}
        className="text-left outline-offset-4"
        type="button"
      >
        <H4>{humanize(following)}</H4>
        <div className="ld-text-gray-500">Following</div>
      </button>
      <Link
        className="text-left outline-offset-4"
        href={`${profileLink}/followers`}
      >
        <H4>{humanize(followers)}</H4>
        <div className="ld-text-gray-500">{plur("Follower", followers)}</div>
      </Link>
      <Modal
        onClose={() => setShowFollowingModal(false)}
        show={showFollowingModal}
        title="Following"
      >
        <Following handle={getProfile(profile).slug} profileId={profile.id} />
      </Modal>
    </div>
  );
};

export default Followerings;
