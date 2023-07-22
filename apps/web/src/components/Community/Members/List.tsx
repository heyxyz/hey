import Loader from '@components/Shared/Loader';
import { UsersIcon } from '@heroicons/react/outline';
import { COMMUNITIES_WORKER_URL } from '@lenster/data/constants';
import type { Community } from '@lenster/types/communities';
import { EmptyState, ErrorMessage } from '@lenster/ui';
import { t, Trans } from '@lingui/macro';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import type { FC } from 'react';
import { Virtuoso } from 'react-virtuoso';

interface MembersListProps {
  community: Community;
}

const MembersList: FC<MembersListProps> = ({ community }) => {
  const fetchMembers = async (offset: number) => {
    try {
      const response = await axios(
        `${COMMUNITIES_WORKER_URL}/members/${community.id}/${offset}`
      );

      return response.data.map(
        (obj: { id: string; profile_id: string }) => obj.profile_id
      );
    } catch (error) {
      return [];
    }
  };

  const { data, isFetching, error } = useInfiniteQuery({
    queryFn: ({ pageParam = 0 }) => fetchMembers(pageParam)
  });

  if (isFetching) {
    return <Loader message={t`Loading members`} />;
  }

  const members = data?.pages;

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
        itemContent={(index, member) => {
          return (
            <div
              className="cursor-pointer p-5 hover:bg-gray-100 dark:hover:bg-gray-900"
              aria-hidden="true"
            >
              {/* <UserProfile
                profile={following?.profile as Profile}
                linkToProfile={!onProfileSelected}
                isFollowing={following?.profile?.isFollowedByMe}
                followUnfollowPosition={index + 1}
                followUnfollowSource={FollowUnfollowSource.FOLLOWING_MODAL}
                showBio
                showFollow
                showUserPreview={false}
              /> */}
              {JSON.stringify(member)}
            </div>
          );
        }}
      />
    </div>
  );
};

export default MembersList;
