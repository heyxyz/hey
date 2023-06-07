import QuotedPublication from '@components/Publication/QuotedPublication';
import type { Publication } from '@lenster/lens';
import { usePublicationQuery } from '@lenster/lens';
import type { FC } from 'react';

import PublicationShimmer from '../Shimmer/PublicationShimmer';
import Wrapper from './Wrapper';

interface PublicationProps {
  publicationIds: string[];
}

const Quote: FC<PublicationProps> = ({ publicationIds }) => {
  const { data, loading, error } = usePublicationQuery({
    variables: { request: { publicationId: publicationIds[0] } }
  });

  if (loading) {
    return (
      <Wrapper zeroPadding>
        <PublicationShimmer showActions={false} />
      </Wrapper>
    );
  }

  if (error || !data) {
    return null;
  }

  return (
    <Wrapper zeroPadding>
      <QuotedPublication publication={data.publication as Publication} />
    </Wrapper>
  );
};

export default Quote;
