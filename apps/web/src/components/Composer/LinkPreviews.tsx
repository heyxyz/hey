import type { FC } from 'react';

import Nft from '@components/Publication/HeyOpenActions/Nft';
import getURLs from '@hey/lib/getURLs';
import getNft from '@hey/lib/nft/getNft';
import { usePublicationStore } from 'src/store/non-persisted/usePublicationStore';

const LinkPreviews: FC = () => {
  const publicationContent = usePublicationStore(
    (state) => state.publicationContent
  );

  const urls = getURLs(publicationContent);
  const nft = getNft(urls);

  if (!urls.length || !nft) {
    return null;
  }

  return (
    <div className="m-5">
      <Nft mintLink={nft.mintLink} />
    </div>
  );
};

export default LinkPreviews;
