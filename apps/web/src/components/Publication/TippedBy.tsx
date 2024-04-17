import type { Profile } from '@hey/lens';
import type { FC } from 'react';

import UserProfile from '@components/Shared/UserProfile';
import { TIP_API_URL } from '@hey/data/constants';
import { ProfileLinkSource } from '@hey/data/tracking';
import { useProfilesQuery } from '@hey/lens';
import { Card, ErrorMessage } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

interface TippedByProps {
  id: string;
}

const TippedBy: FC<TippedByProps> = ({ id }) => {
  const { currentProfile } = useProfileStore();

  const fetchTippedBy = async (): Promise<{ profileId: string }[]> => {
    try {
      const response: { data: { tips: { profileId: string }[] } } =
        await axios.get(`${TIP_API_URL}/publication`, {
          params: { publicationId: id }
        });

      return response.data.tips || [];
    } catch {
      return [];
    }
  };

  const { data: tippedBy, error: tippedByError } = useQuery({
    queryFn: fetchTippedBy,
    queryKey: ['fetchTippedBy', id]
  });

  const { data: profiles, error: profilesError } = useProfilesQuery({
    skip: !tippedBy || tippedBy?.length === 0,
    variables: {
      request: {
        where: { profileIds: tippedBy?.map((tip) => tip.profileId) || [] }
      }
    }
  });

  const filteredProfiles = profiles?.profiles.items.slice(0, 5);

  if (
    !tippedBy ||
    tippedBy?.length === 0 ||
    !filteredProfiles ||
    filteredProfiles?.length === 0
  ) {
    return null;
  }

  return (
    <Card as="aside" className="mb-4 space-y-4 p-5">
      <p className="text-lg font-semibold">Tipped by</p>
      <ErrorMessage
        error={tippedByError || profilesError}
        title="Failed to load tipped by"
      />
      {filteredProfiles?.map((profile) => (
        <div className="w-full truncate pr-1" key={profile.id}>
          <UserProfile
            hideFollowButton={currentProfile?.id === profile.id}
            hideUnfollowButton
            profile={profile as Profile}
            source={ProfileLinkSource.StaffPicks}
          />
        </div>
      ))}
    </Card>
  );
};

export default TippedBy;
