import Followers from "@components/Shared/Modal/Followers";
import Following from "@components/Shared/Modal/Following";
import getAccount from "@hey/helpers/getAccount";
import humanize from "@hey/helpers/humanize";
import type { Account, AccountStats } from "@hey/indexer";
import { H4, Modal } from "@hey/ui";
import plur from "plur";
import { type FC, useState } from "react";

interface FolloweringsProps {
  account: Account;
  stats: AccountStats;
}

const Followerings: FC<FolloweringsProps> = ({ account, stats }) => {
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const { graphFollowStats } = stats;

  return (
    <div className="flex gap-8">
      <button
        className="text-left outline-offset-4"
        onClick={() => setShowFollowingModal(true)}
        type="button"
      >
        <H4>{humanize(graphFollowStats?.following)}</H4>
        <div className="ld-text-gray-500">Following</div>
      </button>
      <button
        className="text-left outline-offset-4"
        onClick={() => setShowFollowersModal(true)}
        type="button"
      >
        <H4>{humanize(graphFollowStats?.followers)}</H4>
        <div className="ld-text-gray-500">
          {plur("Follower", graphFollowStats?.followers)}
        </div>
      </button>
      <Modal
        onClose={() => setShowFollowingModal(false)}
        show={showFollowingModal}
        title="Following"
        size="md"
      >
        <Following
          handle={getAccount(account).slug}
          address={account.address}
        />
      </Modal>
      <Modal
        onClose={() => setShowFollowersModal(false)}
        show={showFollowersModal}
        title="Followers"
        size="md"
      >
        <Followers
          handle={getAccount(account).slug}
          address={account.address}
        />
      </Modal>
    </div>
  );
};

export default Followerings;
