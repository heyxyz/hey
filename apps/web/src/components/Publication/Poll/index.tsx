import type { Poll as TPoll } from '@hey/types/hey';
import type { FC } from 'react';

import { HEY_API_URL } from '@hey/data/constants';
import { Spinner } from '@hey/ui';
import getAuthWorkerHeaders from '@lib/getAuthWorkerHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import Wrapper from '../../Shared/Embed/Wrapper';
import Choices from './Choices';

interface SnapshotProps {
  id: string;
}

const Poll: FC<SnapshotProps> = ({ id }) => {
  const fetchPoll = async (): Promise<null | TPoll> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/poll/get`, {
        headers: {
          ...getAuthWorkerHeaders(),
          'X-Skip-Cache': true
        },
        params: { id }
      });
      const { data } = response;

      return data?.result;
    } catch {
      return null;
    }
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryFn: fetchPoll,
    queryKey: ['fetchPoll', id]
  });

  if (isLoading) {
    // TODO: Add skeleton loader here
    return (
      <Wrapper>
        <div className="flex items-center justify-center">
          <Spinner size="xs" />
        </div>
      </Wrapper>
    );
  }

  if (!data?.id || error) {
    return null;
  }

  return <Choices poll={data} refetch={refetch} />;
};

export default Poll;
