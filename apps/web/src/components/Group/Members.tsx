import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { ArrowLeftIcon, UsersIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { AccountLinkSource } from "@hey/data/tracking";
import { type Account, useAccountsQuery } from "@hey/indexer";
import { Card, EmptyState, ErrorMessage, H5 } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const GET_CLUB_MEMBERS_QUERY_KEY = "getClubMembers";

interface MembersProps {
  address: string;
  slug: string;
}

const Members: FC<MembersProps> = ({ address, slug }) => {
  const { currentAccount } = useAccountStore();

  const getGroupMembers = async (): Promise<{
    items: GroupProfile[];
    pageInfo: {
      next: null | string;
      prev: null | string;
    };
  } | null> => {
    try {
      const { data } = await axios.post(`${HEY_API_URL}/clubs/members`, {
        id: clubId,
        limit: 50
      });

      return data.data;
    } catch {
      return null;
    }
  };

  const {
    data: clubMembers,
    error: clubMembersError,
    isLoading: clubMembersLoading
  } = useQuery({
    enabled: Boolean(clubId),
    queryFn: getClubMembers,
    queryKey: [GET_CLUB_MEMBERS_QUERY_KEY, clubId]
  });

  const addresses = clubMembers?.items.map((item) => item.id) || [];

  const {
    data: lensProfiles,
    error: lensProfilesError,
    loading: lensProfilesLoading
  } = useAccountsQuery({
    skip: !addresses.length,
    variables: { request: { addresses } }
  });

  const members = lensProfiles?.accounts || [];

  if (clubMembersLoading || lensProfilesLoading) {
    return (
      <Card>
        <AccountListShimmer />
      </Card>
    );
  }

  if (members.length === 0) {
    return (
      <EmptyState
        icon={<UsersIcon className="size-8" />}
        message={
          <div>
            <b className="mr-1">/{slug}</b>
            <span>doesn't have any members.</span>
          </div>
        }
      />
    );
  }

  if (clubMembersError || lensProfilesError) {
    return (
      <ErrorMessage
        className="m-5"
        error={clubMembersError || lensProfilesError}
        title="Failed to load members"
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-3 p-5">
        <Link href={`/g/${slug}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <H5>Members</H5>
      </div>
      <div className="divider" />
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(index, member) => `${member.address}-${index}`}
        data={members}
        itemContent={(_, member) => (
          <div className="p-5">
            <SingleAccount
              hideFollowButton={currentAccount?.address === member.address}
              hideUnfollowButton={currentAccount?.address === member.address}
              account={member as Account}
              showBio
              showUserPreview={false}
              source={AccountLinkSource.ClubMembers}
            />
          </div>
        )}
        useWindowScroll
      />
    </Card>
  );
};

export default Members;