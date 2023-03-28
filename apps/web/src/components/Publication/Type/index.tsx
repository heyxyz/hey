import type { Publication } from 'lens';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import type { FC } from 'react';

import Mirrored from './Mirrored';

interface PublicationTypeProps {
  publication: Publication;
  showType: boolean;
}

const PublicationType: FC<PublicationTypeProps> = ({ publication, showType }) => {
  const type = publication.__typename;

  if (!showType) {
    return null;
  }

  return (
    <span onClick={stopEventPropagation}>{type === 'Mirror' && <Mirrored publication={publication} />}</span>
  );
};

export default PublicationType;
