import PublicationWrapper from '@components/Shared/PublicationWrapper';
import type { AnyPublication } from '@lenster/lens';
import type { FC } from 'react';

import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';

interface QuotedPublicationProps {
  publication: AnyPublication;
  isNew?: boolean;
}

const QuotedPublication: FC<QuotedPublicationProps> = ({
  publication,
  isNew = false
}) => {
  return (
    <PublicationWrapper
      className="cursor-pointer p-5 first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100 dark:hover:bg-gray-900"
      publication={publication}
    >
      <PublicationHeader publication={publication} quoted isNew={isNew} />
      {publication?.hidden ? (
        <HiddenPublication type={publication.__typename} />
      ) : (
        <PublicationBody publication={publication} showMore quoted />
      )}
    </PublicationWrapper>
  );
};

export default QuotedPublication;
