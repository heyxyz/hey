import Snapshot from '@components/Publication/OpenActions/Snapshot';
import Attachments from '@components/Shared/Attachments';
import Quote from '@components/Shared/Embed/Quote';
import Markup from '@components/Shared/Markup';
import Oembed from '@components/Shared/Oembed';
import { EyeIcon } from '@heroicons/react/24/outline';
import type { Publication } from '@hey/lens';
import getPublicationAttribute from '@hey/lib/getPublicationAttribute';
import getSnapshotProposalId from '@hey/lib/getSnapshotProposalId';
import getURLs from '@hey/lib/getURLs';
import getNft from '@hey/lib/nft/getNft';
import removeUrlAtEnd from '@hey/lib/removeUrlAtEnd';
import type { OG } from '@hey/types/misc';
import cn from '@hey/ui/cn';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';
import { isIOS, isMobile } from 'react-device-detect';

import DecryptedPublicationBody from './DecryptedPublicationBody';
import Nft from './OpenActions/Nft';

interface PublicationBodyProps {
  publication: Publication;
  showMore?: boolean;
  quoted?: boolean;
}

const PublicationBody: FC<PublicationBodyProps> = ({
  publication,
  showMore = false,
  quoted = false
}) => {
  const { id, metadata } = publication;
  const canShowMore = metadata?.content?.length > 450 && showMore;
  const urls = getURLs(metadata?.content);
  const hasURLs = urls.length > 0;
  const snapshotProposalId = getSnapshotProposalId(urls);
  const nft = getNft(urls);
  const quotedPublicationId = getPublicationAttribute(
    metadata.attributes,
    'quotedPublicationId'
  );
  const filterId = snapshotProposalId || quotedPublicationId;
  let rawContent = metadata?.content;

  if (isIOS && isMobile && canShowMore) {
    const truncatedRawContent = rawContent?.split('\n')?.[0];
    if (truncatedRawContent) {
      rawContent = truncatedRawContent;
    }
  }

  if (filterId) {
    for (const url of urls) {
      if (url.includes(filterId)) {
        rawContent = rawContent?.replace(url, '');
      }
    }
  }

  const [content, setContent] = useState(rawContent);

  if (metadata?.encryptionParams) {
    return <DecryptedPublicationBody encryptedPublication={publication} />;
  }

  // Show NFT if it's there
  const showNft = nft;
  // Show snapshot if it's there
  const showSnapshot = snapshotProposalId;
  // Show attachments if it's there
  const showAttachments = metadata?.media?.length > 0;
  // Show quoted publication if it's there
  const showQuotedPublication = quotedPublicationId && !quoted;
  // Show oembed if no NFT, no attachments, no snapshot, no quoted publication
  const showOembed =
    hasURLs &&
    !showNft &&
    !showAttachments &&
    !showSnapshot &&
    !showQuotedPublication &&
    !quoted;

  // Remove URL at the end if oembed is there
  const onOembedData = (data: OG) => {
    if (showOembed && data?.title) {
      const updatedContent = removeUrlAtEnd(urls, content);
      if (updatedContent !== content) {
        setContent(updatedContent);
      }
    }
  };

  return (
    <div className="break-words">
      <Markup
        className={cn(
          { 'line-clamp-5': canShowMore },
          'markup linkify text-md break-words'
        )}
      >
        {content}
      </Markup>
      {canShowMore ? (
        <div className="lt-text-gray-500 mt-4 flex items-center space-x-1 text-sm font-bold">
          <EyeIcon className="h-4 w-4" />
          <Link href={`/posts/${id}`}>
            <Trans>Show more</Trans>
          </Link>
        </div>
      ) : null}
      {/* Attachments and Quotes */}
      {showAttachments ? (
        <Attachments attachments={metadata?.media} publication={publication} />
      ) : null}
      {/* Open actions */}
      {showSnapshot ? <Snapshot proposalId={snapshotProposalId} /> : null}
      {showNft ? <Nft nftMetadata={nft} publication={publication} /> : null}
      {showOembed ? (
        <Oembed
          url={urls[0]}
          publicationId={publication.id}
          onData={onOembedData}
        />
      ) : null}
      {showQuotedPublication ? (
        <Quote publicationId={quotedPublicationId} />
      ) : null}
    </div>
  );
};

export default PublicationBody;
