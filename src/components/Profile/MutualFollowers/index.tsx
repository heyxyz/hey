import { gql, useQuery } from '@apollo/client';
import { Modal } from '@components/UI/Modal';
import { Profile } from '@generated/types';
import { UsersIcon } from '@heroicons/react/outline';
import getAvatar from '@lib/getAvatar';
import { Hog } from '@lib/hog';
import React, { FC, ReactNode, useState } from 'react';
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

  const Wrapper = ({ children }: { children: ReactNode }) => (
    <div
      className="mr-0 sm:mr-10 text-sm text-gray-500 flex items-center space-x-2.5 cursor-pointer"
      onClick={() => {
        setShowMutualFollowersModal(true);
        Hog.track(PROFILE.OPEN_MUTUAL_FOLLOWERS);
      }}
    >
      <div className="contents -space-x-2">
        {profiles?.map((profile: Profile) => (
          <img
            key={profile?.id}
            className="w-5 h-5 rounded-full border dark:border-gray-700/80"
            src={getAvatar(profile)}
            alt={profile?.handle}
          />
        ))}
      </div>
      <div>
        <span>Followed by </span>
        {children}
      </div>
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

  if (totalCount === 0 || loading || error) {
    return null;
  }

  const profileOne = profiles[0];
  const profileTwo = profiles[1];
  const profileThree = profiles[2];

  if (profiles?.length === 1) {
    return (
      <Wrapper>
        <span>{profileOne?.name ?? profileOne?.handle}</span>
      </Wrapper>
    );
  }

  if (profiles?.length === 2) {
    return (
      <Wrapper>
        <span>{profileOne?.name ?? profileOne?.handle} and </span>
        <span>{profileTwo?.name ?? profileTwo?.handle}</span>
      </Wrapper>
    );
  }

  if (profiles?.length === 3) {
    const calculatedCount = totalCount - 3;
    const isZero = calculatedCount === 0;

    return (
      <Wrapper>
        <span>{profileOne?.name ?? profileOne?.handle}, </span>
        <span>
          {profileTwo?.name ?? profileTwo?.handle}
          {isZero ? ' and ' : ', '}
        </span>
        <span>{profileThree?.name ?? profileThree?.handle} </span>
        {!isZero && (
          <span>
            and {calculatedCount} {calculatedCount === 1 ? 'other' : 'others'}
          </span>
        )}
      </Wrapper>
    );
  }

  return null;
};

export default MutualFollowers;
