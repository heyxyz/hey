import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { HEY_API_URL } from '@hey/data/constants';
import { Card, CardHeader, ErrorMessage, NumberedStat } from '@hey/ui';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import useLensAuthData from 'src/hooks/useAuthApiHeaders';

const PublicationStats: FC = () => {
  const lensAuthData = useLensAuthData();

  const getPublicationStats = async (): Promise<{
    actions: number;
    bookmarks: number;
    collects: number;
    comments: number;
    currency: string;
    mirrors: number;
    publications: number;
    quotes: number;
    reactions: number;
  }> => {
    const response = await axios.get(
      `${HEY_API_URL}/lens/internal/stats/publication`,
      { headers: { ...lensAuthData } }
    );
    return response.data.result;
  };

  const { data, error, isLoading } = useQuery({
    queryFn: getPublicationStats,
    queryKey: ['getPublicationStats'],
    refetchInterval: 2000
  });

  if (isLoading) {
    return (
      <Card>
        <Loader className="my-10" message="Loading publication stats..." />
      </Card>
    );
  }

  if (error) {
    return (
      <ErrorMessage error={error} title="Failed to load publication stats" />
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardHeader title="Publication Stats" />
      <div className="m-5 grid grid-cols-2 gap-2 sm:grid-cols-3">
        <NumberedStat
          count={data.publications.toString()}
          name="Publications"
        />
        <NumberedStat count={data.comments.toString()} name="Comments" />
        <NumberedStat count={data.mirrors.toString()} name="Mirrors" />
        <NumberedStat count={data.quotes.toString()} name="Quotes" />
        <NumberedStat count={data.reactions.toString()} name="Reactions" />
        <NumberedStat count={data.collects.toString()} name="Collects" />
        <NumberedStat count={data.actions.toString()} name="Actions" />
        <NumberedStat count={data.bookmarks.toString()} name="Bookmarks" />
      </div>
    </Card>
  );
};

export default PublicationStats;
