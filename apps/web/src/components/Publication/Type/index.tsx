import type { AnyPublication } from '@hey/lens';
import type { FC } from 'react';

import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { useRouter } from 'next/router';

import Commented from './Commented';
import Mirrored from './Mirrored';

interface PublicationTypeProps {
  publication: AnyPublication;
  showThread?: boolean;
  showType: boolean;
}

const PublicationType: FC<PublicationTypeProps> = ({
  publication,
  showThread = false,
  showType
}) => {
  const { pathname } = useRouter();
  const type = publication.__typename;

  if (!showType) {
    return null;
  }

  return (
    <span onClick={stopEventPropagation}>
      {type === 'Mirror' ? <Mirrored profile={publication.by} /> : null}
      {type === 'Comment' && (showThread || pathname === '/posts/[id]') ? (
        <Commented publication={publication} />
      ) : null}
    </span>
  );
};

export default PublicationType;
