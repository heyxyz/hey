import type { Publication } from 'lens';
import { stopEventPropagation } from 'lib/stopEventPropagation';
import { useRouter } from 'next/router';
import type { Dispatch, FC, SetStateAction } from 'react';

import Commented from './Commented';
import Mirrored from './Mirrored';

interface PublicationTypeProps {
  publication: Publication;
  showType: boolean;
  showThread?: boolean;
  roundAddress?: string;
  setRoundAddress?: Dispatch<SetStateAction<string>>;
}

const PublicationType: FC<PublicationTypeProps> = ({
  publication,
  showType,
  showThread = false,
  roundAddress,
  setRoundAddress
}) => {
  const { pathname } = useRouter();
  const type = publication.__typename;

  if (!showType) {
    return null;
  }

  return (
    <span onClick={stopEventPropagation} aria-hidden="true">
      {type === 'Mirror' && <Mirrored publication={publication} />}
      {type === 'Comment' && (showThread || pathname === '/posts/[id]') && (
        <Commented publication={publication} roundAddress={roundAddress} setRoundAddress={setRoundAddress} />
      )}
    </span>
  );
};

export default PublicationType;
