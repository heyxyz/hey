import type { FC } from 'react';

import Oembed from '@components/Shared/Oembed';
import getURLs from '@hey/lib/getURLs';
import { usePublicationAttachmentStore } from 'src/store/non-persisted/publication/usePublicationAttachmentStore';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';

const LinkPreviews: FC = () => {
  const { publicationContent } = usePublicationStore();
  const { attachments } = usePublicationAttachmentStore((state) => state);

  const urls = getURLs(publicationContent);

  if (!urls.length || attachments.length) {
    return null;
  }

  return <Oembed className="m-5" url={urls[0]} />;
};

export default LinkPreviews;
