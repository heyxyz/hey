import SinglePublication from '@components/Publication/SinglePublication';
import { Publication, usePublicationQuery } from '@lenster/lens';
import stopEventPropagation from '@lenster/lib/stopEventPropagation';
import { Card } from '@lenster/ui';
import type { FC } from 'react';

interface PublicationProps {
  publicationIds: string[];
}

const Publication: FC<PublicationProps> = ({ publicationIds }) => {
  const { data, loading, error } = usePublicationQuery({
    variables: { request: { publicationId: publicationIds[0] } }
  });

  if (loading) {
    return null;
  }

  if (error || !data) {
    return null;
  }

  return (
    <Card
      className="mt-3 cursor-auto"
      forceRounded
      onClick={stopEventPropagation}
    >
      <SinglePublication
        publication={data.publication as Publication}
        showThread={false}
        showType={false}
        showActions={false}
        showMore
      />
    </Card>
  );
};

export default Publication;
