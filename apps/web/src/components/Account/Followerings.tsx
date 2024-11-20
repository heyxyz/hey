import Followers from "@components/Shared/Modal/Followers";
import Following from "@components/Shared/Modal/Following";
import { Leafwatch } from "@helpers/leafwatch";
import { ACCOUNT } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import humanize from "@hey/helpers/humanize";
import type { Profile } from "@hey/lens";
import { H4, Modal } from "@hey/ui";
import plur from "plur";
import { type FC, useState } from "react";

interface FolloweringsProps {
  account: Profile;
}

const Followerings: FC<FolloweringsProps> = ({ account }) => {
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const { followers, following } = account.stats;

  return (
    <div className="flex gap-8">
      <button
        className="text-left outline-offset-4"
        onClick={() => setShowFollowingModal(true)}
        type="button"
      >
        <H4>{humanize(following)}</H4>
        <div className="ld-text-gray-500">Following</div>
      </button>
      <button
        className="text-left outline-offset-4"
        onClick={() => setShowFollowersModal(true)}
        type="button"
      >
        <H4>{humanize(followers)}</H4>
        <div className="ld-text-gray-500">{plur("Follower", followers)}</div>
      </button>
      <Modal
        onClose={() => {
          Leafwatch.track(ACCOUNT.OPEN_FOLLOWING);
          setShowFollowingModal(false);
        }}
        show={showFollowingModal}
        title="Following"
        size="md"
      >
        <Following handle={getAccount(account).slug} accountId={account.id} />
      </Modal>
      <Modal
        onClose={() => {
          Leafwatch.track(ACCOUNT.OPEN_FOLLOWERS);
          setShowFollowersModal(false);
        }}
        show={showFollowersModal}
        title="Followers"
        size="md"
      >
        <Followers handle={getAccount(account).slug} accountId={account.id} />
      </Modal>
    </div>
  );
};

export default Followerings;
