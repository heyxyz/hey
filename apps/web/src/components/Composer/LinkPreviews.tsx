import type { FC } from 'react';

import Oembed from '@components/Shared/Oembed';
import getURLs from '@hey/lib/getURLs';
import { usePublicationStore } from 'src/store/non-persisted/publication/usePublicationStore';

interface LinkPreviewProps {
  openActionEmbed: boolean;
  openActionEmbedLoading: boolean;
}

const LinkPreviews: FC<LinkPreviewProps> = ({
  openActionEmbed,
  openActionEmbedLoading
}) => {
  const { publicationContent } = usePublicationStore();

  const urls = getURLs(publicationContent);

  if (!urls.length) {
    return null;
  }

  return (
    <Oembed
      className="m-5"
      openActionEmbed={openActionEmbed}
      openActionEmbedLoading={openActionEmbedLoading}
      url={urls[0]}
    />
  );
};

export default LinkPreviews;
