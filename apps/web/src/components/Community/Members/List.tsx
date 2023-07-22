import Loader from '@components/Shared/Loader';
import UserProfile from '@components/Shared/UserProfile';
import { UsersIcon } from '@heroicons/react/outline';
import { COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import { FollowUnfollowSource } from '@lenster/data/tracking';
import type { Profile } from '@lenster/lens';
import { useProfilesLazyQuery } from '@lenster/lens';
import type { Community } from '@lenster/types/communities';
import { EmptyState, ErrorMessage } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC, useState } from 'react';
import { Virtuoso } from 'react-virtuoso';

interface MembersListProps {
  community: Community;
}

const MembersList: FC<MembersListProps> = ({ community }) => {
  const [offset, setOffset] = useState(0);
  const [fetchProfiles] = useProfilesLazyQuery();

  const fetchMembers = async () => {
    try {
      const response = await axios(
        `${COMMUNITIES_WORKER_URL}/members/${community.id}/${offset}`
      );

      const profileIds = response.data.map(
        (obj: { id: string; profile_id: string }) => obj.profile_id
      );

      const profiles = await fetchProfiles({
        variables: { request: { profileIds } }
      });

      return profiles.data?.profiles.items;
    } catch (error) {
      return [];
    }
  };

  const {
    data: members,
    isLoading,
    error
  } = useQuery(['communityMembers', community.id, offset], () =>
    fetchMembers().then((res) => res)
  );

  if (isLoading) {
    return <Loader message={t`Loading members`} />;
  }

  if (members?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <span className="mr-1 font-bold">{community.slug}</span>
            <span>
              <Trans>doesn’t have any members.</Trans>
            </span>
          </div>
        }
        icon={<UsersIcon className="text-brand h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto" data-testid="members-modal">
      <ErrorMessage
        className="m-5"
        title={t`Failed to load members`}
        error={error as Error}
      />
      <Virtuoso
        className="virtual-profile-list"
        data={members}
        itemContent={(index, profile) => {
          return (
            <div className="p-5">
              <UserProfile
                profile={profile as Profile}
                isFollowing={profile?.isFollowedByMe}
                followUnfollowPosition={index + 1}
                followUnfollowSource={
                  FollowUnfollowSource.COMMUNITY_MEMBERS_MODAL
                }
                showBio
                showFollow
                showUserPreview={false}
              />
            </div>
          );
        }}
      />
      {/* {members?.pages.map((page: any) => (
        <>
          {page.map((profile: Profile, index: number) => (
            <div key={profile.id}>
              <UserProfile
                profile={profile as Profile}
                isFollowing={profile?.isFollowedByMe}
                followUnfollowPosition={index + 1}
                followUnfollowSource={
                  FollowUnfollowSource.COMMUNITY_MEMBERS_MODAL
                }
                showBio
                showFollow
                showUserPreview={false}
              />
            </div>
          ))}
        </>
      ))} */}
    </div>
  );
};

export default MembersList;
