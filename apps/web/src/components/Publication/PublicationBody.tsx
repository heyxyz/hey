import type { AnyPublication } from '@hey/lens';
import type { OG } from '@hey/types/misc';
import type { FC } from 'react';

import Attachments from '@components/Shared/Attachments';
import Quote from '@components/Shared/Embed/Quote';
import Markup from '@components/Shared/Markup';
import Oembed from '@components/Shared/Oembed';
import Video from '@components/Shared/Video';
import { EyeIcon } from '@heroicons/react/24/outline';
import getPublicationAttribute from '@hey/lib/getPublicationAttribute';
import getPublicationData from '@hey/lib/getPublicationData';
import getURLs from '@hey/lib/getURLs';
import isPublicationMetadataTypeAllowed from '@hey/lib/isPublicationMetadataTypeAllowed';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import removeUrlAtEnd from '@hey/lib/removeUrlAtEnd';
import cn from '@hey/ui/cn';
import Link from 'next/link';
import { memo, useState } from 'react';
import { isIOS, isMobile } from 'react-device-detect';

import EncryptedPublication from './EncryptedPublication';
import Nft from './HeyOpenActions/Nft';
import Metadata from './Metadata';
import NotSupportedPublication from './NotSupportedPublication';
import Poll from './Poll';

interface PublicationBodyProps {
  publication: AnyPublication;
  quoted?: boolean;
  showMore?: boolean;
}

const PublicationBody: FC<PublicationBodyProps> = ({
  publication,
  quoted = false,
  showMore = false
}) => {
  const targetPublication = isMirrorPublication(publication)
    ? publication.mirrorOn
    : publication;
  const { id, metadata } = targetPublication;

  const filteredContent = getPublicationData(metadata)?.content || '';
  const filteredAttachments = getPublicationData(metadata)?.attachments || [];
  const filteredAsset = getPublicationData(metadata)?.asset;

  const canShowMore = filteredContent?.length > 450 && showMore;
  const urls = getURLs(filteredContent);
  const hasURLs = urls.length > 0;

  let rawContent = filteredContent;

  if (isIOS && isMobile && canShowMore) {
    const truncatedRawContent = rawContent?.split('\n')?.[0];
    if (truncatedRawContent) {
      rawContent = truncatedRawContent;
    }
  }

  const [content, setContent] = useState(rawContent);

  if (targetPublication.isEncrypted) {
    return <EncryptedPublication publication={targetPublication} />;
  }

  if (!isPublicationMetadataTypeAllowed(metadata.__typename)) {
    return <NotSupportedPublication type={metadata.__typename} />;
  }

  // Show NFT if it's there
  const showNft = metadata.__typename === 'MintMetadataV3';
  // Show live if it's there
  const showLive = metadata.__typename === 'LiveStreamMetadataV3';
  // Show attachments if it's there
  const showAttachments = filteredAttachments.length > 0 || filteredAsset;
  // Show poll
  const pollId = getPublicationAttribute(metadata.attributes, 'pollId');
  const showPoll = Boolean(pollId);
  // Show sharing link
  const showSharingLink = metadata.__typename === 'LinkMetadataV3';
  // Show oembed if no NFT, no attachments, no quoted publication
  const showOembed =
    !showSharingLink &&
    hasURLs &&
    !showNft &&
    !showLive &&
    !showAttachments &&
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
        mentions={targetPublication.profilesMentioned}
      >
        {content}
      </Markup>
      {canShowMore ? (
        <div className="ld-text-gray-500 mt-4 flex items-center space-x-1 text-sm font-bold">
          <EyeIcon className="size-4" />
          <Link href={`/posts/${id}`}>Show more</Link>
        </div>
      ) : null}
      {/* Attachments and Quotes */}
      {showAttachments ? (
        <Attachments asset={filteredAsset} attachments={filteredAttachments} />
      ) : null}
      {/* Poll */}
      {showPoll ? <Poll id={pollId} /> : null}
      {showNft ? (
        <Nft mintLink={metadata.mintLink} publication={publication} />
      ) : null}
      {showLive ? (
        <div className="mt-3">
          <Video src={metadata.liveURL || metadata.playbackURL} />
        </div>
      ) : null}
      {showOembed ? (
        <Oembed
          onData={onOembedData}
          publicationId={publication.id}
          url={urls[0]}
        />
      ) : null}
      {showSharingLink ? (
        <Oembed
          onData={() => {}}
          publicationId={publication.id}
          url={metadata.sharingLink}
        />
      ) : null}
      {targetPublication.__typename === 'Quote' && (
        <Quote publication={targetPublication.quoteOn} />
      )}
      <Metadata publication={publication} />
    </div>
  );
};

export default memo(PublicationBody);
