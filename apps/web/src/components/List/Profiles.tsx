import ProfileListShimmer from "@components/Shared/Shimmer/ProfileListShimmer";
import SingleProfile from "@components/Shared/SingleProfile";
import { ArrowLeftIcon, UsersIcon } from "@heroicons/react/24/outline";
import { HEY_API_URL } from "@hey/data/constants";
import { ProfileLinkSource } from "@hey/data/tracking";
import { type Profile, useProfilesQuery } from "@hey/lens";
import { Card, EmptyState, ErrorMessage, H5 } from "@hey/ui";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import { useProfileStore } from "src/store/persisted/useProfileStore";

const GET_LIST_PROFILES_QUERY_KEY = "getListProfiles";

interface ProfilesProps {
  listId: string;
  name: string;
}

const Profiles: FC<ProfilesProps> = ({ listId, name }) => {
  const { currentProfile } = useProfileStore();

  const getListProfiles = async (): Promise<string[]> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/lists/profiles`, {
        params: { id: listId }
      });

      return response.data?.result;
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
        <ProfileListShimmer />
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
            <SingleProfile
              hideFollowButton={currentProfile?.id === member.id}
              hideUnfollowButton={currentProfile?.id === member.id}
              profile={member as Profile}
              showBio
              showUserPreview={false}
              source={ProfileLinkSource.ListProfiles}
            />
          </div>
        )}
        useWindowScroll
      />
    </Card>
  );
};

export default Profiles;
