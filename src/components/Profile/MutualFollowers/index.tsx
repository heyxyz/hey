import { gql, useQuery } from '@apollo/client';
import { Modal } from '@components/UI/Modal';
import { Profile } from '@generated/types';
import { UsersIcon } from '@heroicons/react/outline';
import getAvatar from '@lib/getAvatar';
import { Mixpanel } from '@lib/mixpanel';
import React, { FC, useState } from 'react';
import { useAppStore } from 'src/store/app';
import { PROFILE } from 'src/tracking';

import MutualFollowersList from './List';

export const MUTUAL_FOLLOWERS_QUERY = gql`
  query MutualFollowersProfiles($request: MutualFollowersProfilesQueryRequest!) {
    mutualFollowersProfiles(request: $request) {
      items {
        handle
        name
        picture {
          ... on MediaSet {
            original {
              url
            }
          }
          ... on NftImage {
            uri
          }
        }
      }
      pageInfo {
        totalCount
      }
    }
  }
`;

interface Props {
  profile: Profile;
}

const MutualFollowers: FC<Props> = ({ profile }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const [showMutualFollowersModal, setShowMutualFollowersModal] = useState(false);

  const { data, loading, error } = useQuery(MUTUAL_FOLLOWERS_QUERY, {
    variables: {
      request: {
        viewingProfileId: profile?.id,
        yourProfileId: currentProfile?.id,
        limit: 3
      }
    },
    skip: !profile?.id,
    fetchPolicy: 'no-cache'
  });

  const profiles = data?.mutualFollowersProfiles?.items;
  const totalCount = data?.mutualFollowersProfiles?.pageInfo?.totalCount;
  const removedCount = profiles?.length <= 3 ? totalCount - profiles?.length : totalCount - 3;

  if (totalCount === 0 || loading || error) {
    return null;
  }

  return (
    <div
      className="mr-0 sm:mr-10 text-sm text-gray-500 flex items-center space-x-2.5 cursor-pointer"
      onClick={() => {
        setShowMutualFollowersModal(true);
        Mixpanel.track(PROFILE.OPEN_MUTUAL_FOLLOWERS);
      }}
    >
      <span className="contents -space-x-2">
        {profiles?.map((profile: Profile) => (
          <img
            key={profile?.id}
            className="w-5 h-5 rounded-full border dark:border-gray-700/80"
            src={getAvatar(profile)}
            alt={profile?.handle}
          />
        ))}
      </span>
      <span>
        <span>Followed by </span>
        {profiles?.map((profile: Profile) => (
          <span key={profile?.id}>
            {profile?.name ?? profile?.handle}
            {removedCount > 0 && ','}{' '}
          </span>
        ))}
        {removedCount > 0 && (
          <span>
            {' '}
            and {removedCount} {removedCount === 1 ? 'other' : 'others'}
          </span>
        )}
      </span>
      <Modal
        title="Followers you know"
        icon={<UsersIcon className="w-5 h-5 text-brand" />}
        show={showMutualFollowersModal}
        onClose={() => setShowMutualFollowersModal(false)}
      >
        <MutualFollowersList profileId={profile?.id} />
      </Modal>
    </div>
  );
};

export default MutualFollowers;
