import type { PrimaryPublication } from '@hey/lens';
import type { FC } from 'react';

import PublicationWrapper from '@components/Shared/PublicationWrapper';
import pushToImpressions from '@lib/pushToImpressions';
import { useInView } from 'react-cool-inview';

import HiddenPublication from './HiddenPublication';
import PublicationBody from './PublicationBody';
import PublicationHeader from './PublicationHeader';

interface QuotedPublicationProps {
  isNew?: boolean;
  publication: PrimaryPublication;
}

const QuotedPublication: FC<QuotedPublicationProps> = ({
  isNew = false,
  publication
}) => {
  const { observe } = useInView({
    onChange: ({ inView }) => {
      if (!inView) {
        return;
      }

      pushToImpressions(publication.id);
    }
  });

  return (
    <PublicationWrapper
      className="cursor-pointer p-5 first:rounded-t-xl last:rounded-b-xl hover:bg-gray-100 dark:hover:bg-gray-900"
      publication={publication}
    >
      <span ref={observe} />
      <PublicationHeader isNew={isNew} publication={publication} quoted />
      {publication.isHidden ? (
        <HiddenPublication type={publication.__typename} />
      ) : (
        <PublicationBody publication={publication} quoted showMore />
      )}
    </PublicationWrapper>
  );
};

export default QuotedPublication;
