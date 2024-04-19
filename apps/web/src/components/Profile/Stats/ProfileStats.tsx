import type { GlobalProfileStats } from '@hey/types/lens';

import Loader from '@components/Shared/Loader';
import { HEY_API_URL, IS_MAINNET } from '@hey/data/constants';
import { Card, CardHeader, ErrorMessage, NumberedStat } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { type FC } from 'react';

interface ProfileStatsProps {
  profileId: string;
}

const ProfileStats: FC<ProfileStatsProps> = ({ profileId }) => {
  const getProfileStats = async (): Promise<GlobalProfileStats | null> => {
    try {
      const response = await axios.get(
        `${HEY_API_URL}/lens/stats/profile/all`,
        { params: { id: profileId } }
      );

      return response.data?.result || null;
    } catch {
      return null;
    }
  };

  const { data, error, isLoading } = useQuery({
    enabled: IS_MAINNET,
    queryFn: getProfileStats,
    queryKey: ['getProfileStats', profileId]
  });

  if (isLoading) {
    return (
      <Card>
        <Loader className="my-10" message="Loading profile stats..." />
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load profile stats" />;
  }

  return (
    <Card>
      <CardHeader title="Global Profile Stats" />
      <div className="m-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <NumberedStat
          count={data.total_publications.toString()}
          name="Publications"
        />
        <NumberedStat count={data.total_posts.toString()} name="Posts" />
        <NumberedStat count={data.total_comments.toString()} name="Comments" />
        <NumberedStat count={data.total_mirrors.toString()} name="Mirrors" />
        <NumberedStat count={data.total_quotes.toString()} name="Quotes" />
        <NumberedStat count={data.total_reacted.toString()} name="Reacted" />
        <NumberedStat
          count={data.total_reactions.toString()}
          name="Reactions Received"
        />
        <NumberedStat count={data.total_collects.toString()} name="Collects" />
        <NumberedStat
          count={data.total_acted.toString()}
          name="Actions on Open Actions"
        />
      </div>
    </Card>
  );
};

export default ProfileStats;
