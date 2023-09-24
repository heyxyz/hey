import Nft from '@components/Publication/OpenActions/Nft';
import Snapshot from '@components/Publication/OpenActions/Snapshot';
import Attachments from '@components/Shared/Attachments';
import Markup from '@components/Shared/Markup';
import Oembed from '@components/Shared/Oembed';
import { EyeIcon } from '@heroicons/react/24/outline';
import type { AnyPublication } from '@lenster/lens';
import getSnapshotProposalId from '@lenster/lib/getSnapshotProposalId';
import getURLs from '@lenster/lib/getURLs';
import getNft from '@lenster/lib/nft/getNft';
import { isMirrorPublication } from '@lenster/lib/publicationHelpers';
import removeUrlAtEnd from '@lenster/lib/removeUrlAtEnd';
import type { OG } from '@lenster/types/misc';
import cn from '@lenster/ui/cn';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';
import { useState } from 'react';

interface PublicationBodyProps {
  publication: AnyPublication;
  showMore?: boolean;
  quoted?: boolean;
}

const PublicationBody: FC<PublicationBodyProps> = ({
  publication,
  showMore = false,
  quoted = false
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { id, metadata } = targetPublication;
  const canShowMore =
    metadata?.marketplace?.description?.length > 450 && showMore;
  const urls = getURLs(metadata?.marketplace?.description);
  const hasURLs = urls.length > 0;
  const snapshotProposalId = getSnapshotProposalId(urls);
  const nft = getNft(urls);
  const filterId = snapshotProposalId;
  let rawContent = metadata?.marketplace?.description;

  if (filterId) {
    for (const url of urls) {
      if (url.includes(filterId)) {
        rawContent = rawContent?.replace(url, '');
      }
    }
  }

  const [content, setContent] = useState(rawContent);

  // Show NFT if it's there
  const showNft = nft;
  // Show snapshot if it's there
  const showSnapshot = snapshotProposalId;
  // Show attachments if it's there
  const showAttachments =
    (metadata.__typename === 'AudioMetadataV3' ||
      metadata.__typename === 'ImageMetadataV3' ||
      metadata.__typename === 'VideoMetadataV3' ||
      metadata.__typename === 'ArticleMetadataV3') &&
    (metadata.attachments?.length ?? 0) > 0;
  // Show oembed if no NFT, no attachments, no snapshot, no quoted publication
  const showOembed =
    hasURLs && !showNft && !showAttachments && !showSnapshot && !quoted;

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
      {metadata.__typename}
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
      {/* <Quote publication={publication} /> */}
      {showAttachments ? (
        <Attachments
          attachments={metadata?.attachments}
          publication={publication}
        />
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
    </div>
  );
};

export default PublicationBody;
