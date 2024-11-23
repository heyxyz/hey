import AccountListShimmer from "@components/Shared/Shimmer/AccountListShimmer";
import SingleAccount from "@components/Shared/SingleAccount";
import { ArrowLeftIcon, UsersIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { AccountLinkSource } from "@hey/data/tracking";
import { type Profile, useProfilesQuery } from "@hey/lens";
import { Card, EmptyState, ErrorMessage, H5 } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useAccountStore } from "src/store/persisted/useAccountStore";

const GET_LIST_PROFILES_QUERY_KEY = "getListProfiles";

interface AccountsProps {
  listId: string;
  name: string;
}

const Accounts: FC<AccountsProps> = ({ listId, name }) => {
  const { currentAccount } = useAccountStore();

  const getListProfiles = async (): Promise<string[]> => {
    try {
      const { data } = await axios.get(`${HEY_API_URL}/lists/accounts`, {
        params: { id: listId }
      });

      return data?.result;
    } catch {
      return [];
    }
  };

  const {
    data: profileIds,
    error: listProfilesError,
    isLoading: listProfilesLoading
  } = useQuery({
    enabled: Boolean(listId),
    queryFn: getListProfiles,
    queryKey: [GET_LIST_PROFILES_QUERY_KEY, listId]
  });

  const {
    data: lensProfiles,
    error: lensProfilesError,
    loading: lensProfilesLoading
  } = useProfilesQuery({
    skip: !profileIds?.length,
    variables: { request: { where: { profileIds } } }
  });

  const members = lensProfiles?.profiles.items || [];

  if (listProfilesLoading || lensProfilesLoading) {
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
            <b className="mr-1">/{name}</b>
            <span>doesn't have any profiles.</span>
          </div>
        }
      />
    );
  }

  if (listProfilesError || lensProfilesError) {
    return (
      <ErrorMessage
        className="m-5"
        error={listProfilesError || lensProfilesError}
        title="Failed to load profiles"
      />
    );
  }

  return (
    <Card>
      <div className="flex items-center space-x-3 p-5">
        <Link href={`/lists/${listId}`}>
          <ArrowLeftIcon className="size-5" />
        </Link>
        <H5>Profiles</H5>
      </div>
      <div className="divider" />
      <Virtuoso
        className="virtual-divider-list-window"
        computeItemKey={(index, member) => `${member.id}-${index}`}
        data={members}
        itemContent={(_, member) => (
          <div className="p-5">
            <SingleAccount
              hideFollowButton={currentAccount?.id === member.id}
              hideUnfollowButton={currentAccount?.id === member.id}
              account={member as Profile}
              showBio
              showUserPreview={false}
              source={AccountLinkSource.ListAccounts}
            />
          </div>
        )}
        useWindowScroll
      />
    </Card>
  );
};

export default Accounts;
