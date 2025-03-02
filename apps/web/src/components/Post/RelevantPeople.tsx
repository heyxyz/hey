import SingleAccountShimmer from "@components/Shared/Shimmer/SingleAccountShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import {
  type AccountFragment,
  type PostMentionFragment,
  useAccountsBulkQuery
} from "@hey/indexer";
import { Card, ErrorMessage, Modal } from "@hey/ui";
import type { FC } from "react";
import { useState } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import MoreRelevantPeople from "./MoreRelevantPeople";

interface RelevantPeopleProps {
  mentions: PostMentionFragment[];
}

const RelevantPeople: FC<RelevantPeopleProps> = ({ mentions }) => {
  const { currentAccount } = useAccountStore();
  const [showMore, setShowMore] = useState(false);

  const accountAddresses = mentions.map((accountMention) =>
    accountMention.__typename === "AccountMention"
      ? accountMention.account
      : accountMention.replace.from
  );

  const { data, error, loading } = useAccountsBulkQuery({
    skip: accountAddresses.length <= 0,
    variables: { request: { addresses: accountAddresses } }
  });

  if (accountAddresses.length <= 0) {
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

  if (data?.accountsBulk?.length === 0) {
    return null;
  }

  const firstAccounts = data?.accountsBulk?.slice(0, 5);

  return (
    <>
      <Card as="aside" className="space-y-4 p-5">
        <ErrorMessage error={error} title="Failed to load relevant people" />
        {firstAccounts?.map((account) => (
          <div className="truncate" key={account?.address}>
            <SingleAccount
              hideFollowButton={currentAccount?.address === account.address}
              hideUnfollowButton={currentAccount?.address === account.address}
              account={account}
              showUserPreview={false}
            />
          </div>
        ))}
        {(data?.accountsBulk?.length || 0) > 5 && (
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
        <MoreRelevantPeople
          accounts={data?.accountsBulk as AccountFragment[]}
        />
      </Modal>
    </>
  );
};

export default RelevantPeople;
