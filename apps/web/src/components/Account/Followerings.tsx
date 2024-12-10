import Followers from "@components/Shared/Modal/Followers";
import Following from "@components/Shared/Modal/Following";
import getAccount from "@hey/helpers/getAccount";
import humanize from "@hey/helpers/humanize";
import { type Account, useAccountStatsQuery } from "@hey/indexer";
import { H4, Modal } from "@hey/ui";
import plur from "plur";
import { type FC, useState } from "react";

interface FolloweringsProps {
  account: Account;
}

const Followerings: FC<FolloweringsProps> = ({ account }) => {
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [showFollowersModal, setShowFollowersModal] = useState(false);

  const { data, loading } = useAccountStatsQuery({
    variables: { request: { account: account.address } }
  });

  if (loading) {
    return null;
  }

  if (!data) {
    return null;
  }

  const stats = data.accountStats.graphFollowStats;

  return (
    <div className="flex gap-8">
      <button
        className="text-left outline-offset-4"
        onClick={() => setShowFollowingModal(true)}
        type="button"
      >
        <H4>{humanize(stats?.following)}</H4>
        <div className="ld-text-gray-500">Following</div>
      </button>
      <button
        className="text-left outline-offset-4"
        onClick={() => setShowFollowersModal(true)}
        type="button"
      >
        <H4>{humanize(stats?.followers)}</H4>
        <div className="ld-text-gray-500">
          {plur("Follower", stats?.followers)}
        </div>
      </button>
      <Modal
        onClose={() => setShowFollowingModal(false)}
        show={showFollowingModal}
        title="Following"
        size="md"
      >
        <Following
          handle={getAccount(account).username}
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
          handle={getAccount(account).username}
          address={account.address}
        />
      </Modal>
    </div>
  );
};

export default Followerings;
