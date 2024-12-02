import FollowersYouKnow from "@components/Shared/Modal/FollowersYouKnow";
import { Leafwatch } from "@helpers/leafwatch";
import { ACCOUNT } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import { type Follower, useFollowersYouKnowQuery } from "@hey/indexer";
import { Modal, StackedAvatars } from "@hey/ui";
import cn from "@hey/ui/cn";
import { type FC, type ReactNode, useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface FollowersYouKnowOverviewProps {
  handle: string;
  address: string;
  viaPopover?: boolean;
}

const FollowersYouKnowOverview: FC<FollowersYouKnowOverviewProps> = ({
  handle,
  address,
  viaPopover = false
}) => {
  const { currentAccount } = useAccountStore();
  const [showMutualFollowersModal, setShowMutualFollowersModal] =
    useState(false);

  const { data, error, loading } = useFollowersYouKnowQuery({
    skip: !address || !currentAccount?.address,
    variables: {
      request: {
        observer: currentAccount?.address,
        target: address
      }
    }
  });

  const accounts =
    (data?.followersYouKnow?.items.slice(0, 4) as Follower[]) || [];

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <button
      className={cn(
        viaPopover ? "text-xs" : "text-sm",
        "ld-text-gray-500 flex cursor-pointer items-center space-x-2"
      )}
      onClick={() => setShowMutualFollowersModal(true)}
      type="button"
    >
      <StackedAvatars
        avatars={accounts.map((account) => getAvatar(account))}
        limit={3}
      />
      <div className="text-left">
        <span>Followed by </span>
        {children}
      </div>
      <Modal
        onClose={() => {
          Leafwatch.track(ACCOUNT.OPEN_MUTUAL_FOLLOWERS);
          setShowMutualFollowersModal(false);
        }}
        show={showMutualFollowersModal}
        title="Mutual Followers"
        size="md"
      >
        <FollowersYouKnow handle={handle} address={address} />
      </Modal>
    </button>
  );

  if (accounts.length === 0 || loading || error) {
    return null;
  }

  const accountOne = accounts[0].follower;
  const accountTwo = accounts[1].follower;
  const accountThree = accounts[2].follower;

  if (accounts?.length === 1) {
    return (
      <Wrapper>
        <span>{getAccount(accountOne).name}</span>
      </Wrapper>
    );
  }

  if (accounts?.length === 2) {
    return (
      <Wrapper>
        <span>{getAccount(accountOne).name} and </span>
        <span>{getAccount(accountTwo).name}</span>
      </Wrapper>
    );
  }

  if (accounts?.length === 3) {
    const calculatedCount = accounts.length - 3;
    const isZero = calculatedCount === 0;

    return (
      <Wrapper>
        <span>{getAccount(accountOne).name}, </span>
        <span>
          {getAccount(accountTwo).name}
          {isZero ? " and " : ", "}
        </span>
        <span>{getAccount(accountThree).name} </span>
        {isZero ? null : (
          <span>
            and {calculatedCount} {calculatedCount === 1 ? "other" : "others"}
          </span>
        )}
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <span>{getAccount(accountOne).name}, </span>
      <span>{getAccount(accountTwo).name}, </span>
      <span>{getAccount(accountThree).name} </span>
      <span>and others</span>
    </Wrapper>
  );
};

export default FollowersYouKnowOverview;
