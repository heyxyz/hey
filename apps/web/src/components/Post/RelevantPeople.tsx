import SingleAccountShimmer from "@components/Shared/Shimmer/SingleAccountShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { AccountLinkSource } from "@hey/data/tracking";
import type { Profile, ProfileMentioned } from "@hey/lens";
import { useProfilesQuery } from "@hey/lens";
import { Card, ErrorMessage, Modal } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import MoreRelevantPeople from "./MoreRelevantPeople";

interface RelevantPeopleProps {
  profilesMentioned: ProfileMentioned[];
}

const RelevantPeople: FC<RelevantPeopleProps> = ({ profilesMentioned }) => {
  const { currentAccount } = useAccountStore();
  const [showMore, setShowMore] = useState(false);

  const profileIds = profilesMentioned.map(
    (profile) => profile.snapshotHandleMentioned.linkedTo?.nftTokenId
  );

  const { data, error, loading } = useProfilesQuery({
    skip: profileIds.length <= 0,
    variables: { request: { where: { profileIds } } }
  });

  if (profileIds.length <= 0) {
    return null;
  }

  if (loading) {
    return (
      <Card as="aside" className="space-y-4 p-5">
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <div className="pt-2 pb-1">
          <div className="shimmer h-3 w-5/12 rounded-full" />
        </div>
      </Card>
    );
  }

  if (data?.profiles?.items?.length === 0) {
    return null;
  }

  const firstAccounts = data?.profiles?.items?.slice(0, 5);

  return (
    <>
      <Card as="aside" className="space-y-4 p-5">
        <ErrorMessage error={error} title="Failed to load relevant people" />
        {firstAccounts?.map((account) => (
          <div className="truncate" key={account?.id}>
            <SingleAccount
              hideFollowButton={currentAccount?.id === account.id}
              hideUnfollowButton={currentAccount?.id === account.id}
              account={account as Profile}
              showUserPreview={false}
              source={AccountLinkSource.RelevantPeople}
            />
          </div>
        ))}
        {(data?.profiles?.items?.length || 0) > 5 && (
          <button
            className="ld-text-gray-500 font-bold"
            onClick={() => setShowMore(true)}
            type="button"
          >
            Show more
          </button>
        )}
      </Card>
      <Modal
        onClose={() => setShowMore(false)}
        show={showMore}
        title="Relevant people"
      >
        <MoreRelevantPeople accounts={data?.profiles?.items as Profile[]} />
      </Modal>
    </>
  );
};

export default RelevantPeople;
