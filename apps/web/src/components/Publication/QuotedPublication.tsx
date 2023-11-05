import PublicationWrapper from '@components/Shared/PublicationWrapper';
import type { PrimaryPublication } from '@hey/lens';
import { type FC, memo } from 'react';

import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';

interface QuotedPublicationProps {
  publication: PrimaryPublication;
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
      {publication.isHidden ? (
        <HiddenPublication type={publication.__typename} />
      ) : (
        <PublicationBody publication={publication} showMore quoted />
      )}
    </PublicationWrapper>
  );
};

export default memo(QuotedPublication);
