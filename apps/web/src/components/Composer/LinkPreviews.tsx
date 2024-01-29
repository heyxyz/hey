import type { FC } from 'react';

import Oembed from '@components/Shared/Oembed';
import getURLs from '@hey/lib/getURLs';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';

const LinkPreviews: FC = () => {
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );

  const urls = getURLs(publicationContent);

  if (!urls.length) {
    return null;
  }

  return <Oembed className="m-5" url={urls[0]} />;
};

export default LinkPreviews;
