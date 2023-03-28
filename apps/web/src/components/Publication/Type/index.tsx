import type { Publication } from 'lens';
import type { FC } from 'react';

import Mirrored from './Mirrored';

interface PublicationTypeProps {
  publication: Publication;
  showType: boolean;
}

const PublicationType: FC<PublicationTypeProps> = ({ publication, showType }) => {
  if (!showType || publication.__typename !== 'Mirror') {
    return null;
  }

  return <Mirrored publication={publication} />;
};

export default PublicationType;
