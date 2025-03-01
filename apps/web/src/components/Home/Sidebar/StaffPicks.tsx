import SingleAccountShimmer from "@components/Shared/Shimmer/SingleAccountShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { CursorArrowRippleIcon as CursorArrowRippleIconOutline } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { useStaffPicksQuery } from "@hey/indexer";
import type { StaffPick } from "@hey/types/hey";
import { Card, EmptyState, ErrorMessage, H5 } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { FC } from "react";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const GET_STAFF_PICKS_QUERY_KEY = "getStaffPicks";

interface BatchRange {
  end: number;
  start: number;
}

const Title: FC = () => <H5>Staff Picks</H5>;

const StaffPicks: FC = () => {
  const { currentAccount } = useAccountStore();

  const getStaffPicks = async (): Promise<StaffPick[]> => {
    const response: {
      data: { result: StaffPick[] };
    } = await axios.get(`${HEY_API_URL}/staff-picks`);

    return response.data.result;
  };

  const {
    data: picks,
    error: picksError,
    isLoading: picksLoading
  } = useQuery({
    queryFn: getStaffPicks,
    queryKey: [GET_STAFF_PICKS_QUERY_KEY]
  });

  const dividePicks = (
    picks: StaffPick[],
    totalBatches: number
  ): BatchRange[] => {
    const perBatch = Math.ceil(picks.length / totalBatches);
    return Array.from({ length: totalBatches }, (_, index) => ({
      end: Math.min((index + 1) * perBatch, picks.length),
      start: index * perBatch
    }));
  };

  const batchRanges = dividePicks(picks || [], 3); // We want to divide into three batches
  const batchVariables = batchRanges.map((range) =>
    picks?.slice(range.start, range.end).map((pick) => pick.accountAddress)
  );
  const canLoadStaffPicks = batchVariables.every(
    (batch) => (batch || []).length > 0
  );

  const {
    data: staffPicks,
    error: accountsError,
    loading: accountsLoading
  } = useStaffPicksQuery({
    skip: !canLoadStaffPicks,
    variables: {
      batch1: batchVariables[0] || [],
      batch2: batchVariables[1] || [],
      batch3: batchVariables[2] || []
    }
  });

  if (picksLoading || accountsLoading) {
    return (
      <Card as="aside" className="mb-4 space-y-4 p-5">
        <Title />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
        <SingleAccountShimmer showFollowUnfollowButton />
      </Card>
    );
  }

  if (picks?.length === 0) {
    return (
      <Card as="aside" className="mb-4 p-5">
        <Title />
        <EmptyState
          hideCard
          icon={<CursorArrowRippleIconOutline className="size-8" />}
          message="Nothing here!"
        />
      </Card>
    );
  }

  const accounts = [
    ...(staffPicks?.batch1 || []),
    ...(staffPicks?.batch2 || []),
    ...(staffPicks?.batch3 || [])
  ];
  const randomAccounts = accounts.sort(() => Math.random() - Math.random());
  const filteredAccounts = randomAccounts
    .filter(
      (account) =>
        !account.operations?.isBlockedByMe &&
        !account.operations?.isFollowedByMe &&
        currentAccount?.address !== account.address
    )
    .slice(0, 5);

  if (filteredAccounts.length === 0) {
    return null;
  }

  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <Title />
      <ErrorMessage
        error={picksError || accountsError}
        title="Failed to load recommendations"
      />
      {filteredAccounts.map((account) => (
        <div className="w-full truncate pr-1" key={account.address}>
          <SingleAccount
            hideFollowButton={currentAccount?.address === account.address}
            hideUnfollowButton
            account={account}
          />
        </div>
      ))}
    </Card>
  );
};

export default StaffPicks;
