import MutualFollowers from "@components/Shared/Modal/MutualFollowers";
import { Leafwatch } from "@helpers/leafwatch";
import { ACCOUNT } from "@hey/data/tracking";
import getAccount from "@hey/helpers/getAccount";
import getAvatar from "@hey/helpers/getAvatar";
import type { Profile } from "@hey/lens";
import { LimitType, useMutualFollowersQuery } from "@hey/lens";
import { Modal, StackedAvatars } from "@hey/ui";
import cn from "@hey/ui/cn";
import { type FC, type ReactNode, useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

interface MutualFollowersOverviewProps {
  handle: string;
  accountId: string;
  viaPopover?: boolean;
}

const MutualFollowersOverview: FC<MutualFollowersOverviewProps> = ({
  handle,
  accountId,
  viaPopover = false
}) => {
  const { currentAccount } = useAccountStore();
  const [showMutualFollowersModal, setShowMutualFollowersModal] =
    useState(false);

  const { data, error, loading } = useMutualFollowersQuery({
    skip: !accountId || !currentAccount?.id,
    variables: {
      request: {
        limit: LimitType.Ten,
        observer: currentAccount?.id,
        viewing: accountId
      }
    }
  });

  const accounts =
    (data?.mutualFollowers?.items.slice(0, 4) as Profile[]) || [];

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
        <MutualFollowers handle={handle} accountId={accountId} />
      </Modal>
    </button>
  );

  if (accounts.length === 0 || loading || error) {
    return null;
  }

  const accountOne = accounts[0];
  const accountTwo = accounts[1];
  const accountThree = accounts[2];

  if (accounts?.length === 1) {
    return (
      <Wrapper>
        <span>{getAccount(accountOne).displayName}</span>
      </Wrapper>
    );
  }

  if (accounts?.length === 2) {
    return (
      <Wrapper>
        <span>{getAccount(accountOne).displayName} and </span>
        <span>{getAccount(accountTwo).displayName}</span>
      </Wrapper>
    );
  }

  if (accounts?.length === 3) {
    const calculatedCount = accounts.length - 3;
    const isZero = calculatedCount === 0;

    return (
      <Wrapper>
        <span>{getAccount(accountOne).displayName}, </span>
        <span>
          {getAccount(accountTwo).displayName}
          {isZero ? " and " : ", "}
        </span>
        <span>{getAccount(accountThree).displayName} </span>
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
      <span>{getAccount(accountOne).displayName}, </span>
      <span>{getAccount(accountTwo).displayName}, </span>
      <span>{getAccount(accountThree).displayName} </span>
      <span>and others</span>
    </Wrapper>
  );
};

export default MutualFollowersOverview;
