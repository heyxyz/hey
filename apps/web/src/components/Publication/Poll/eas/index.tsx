import type { UnknownOpenActionModuleSettings } from '@hey/lens';
import type { EasPoll as TPoll } from '@hey/types/hey';
import type { FC } from 'react';

import Choices from '@components/Publication/Poll/eas/Choices';
import Wrapper from '@components/Shared/Embed/Wrapper';
import { HEY_API_URL } from '@hey/data/constants';
import { Spinner } from '@hey/ui';
import getAuthApiHeaders from '@lib/getAuthApiHeaders';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface EasPollProps {
  module: UnknownOpenActionModuleSettings;
  publicationId: string;
}

const EasPoll: FC<EasPollProps> = ({ module, publicationId }) => {
  const fetchPoll = async (): Promise<null | TPoll> => {
    try {
      const response = await axios.get(`${HEY_API_URL}/polls/eas/get`, {
        headers: { ...getAuthApiHeaders(), 'X-Skip-Cache': true },
        params: { publicationId }
      });
      const { data } = response;

      return data?.result;
    } catch {
      return null;
    }
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryFn: fetchPoll,
    queryKey: ['fetchPoll', publicationId]
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

  if (!data?.options?.length || error) {
    return null;
  }

  return <Choices module={module} poll={data} refetch={refetch} />;
};

export default EasPoll;
