import Attachments from '@components/Shared/Attachments';
import Quote from '@components/Shared/Embed/Quote';
import Markup from '@components/Shared/Markup';
import { EyeIcon } from '@heroicons/react/24/outline';
import type {
  AnyPublication,
  Maybe,
  PublicationMetadataMedia
} from '@hey/lens';
import getSnapshotProposalId from '@hey/lib/getSnapshotProposalId';
import getURLs from '@hey/lib/getURLs';
import getNft from '@hey/lib/nft/getNft';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import removeUrlAtEnd from '@hey/lib/removeUrlAtEnd';
import type { OG } from '@hey/types/misc';
import cn from '@hey/ui/cn';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import { type FC, useState } from 'react';

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
  const metadataType = metadata.__typename;

  const getAttachmentsData = (
    attachments?: Maybe<PublicationMetadataMedia[]>
  ) => {
    if (!attachments) {
      return [];
    }

    attachments.map((attachment) => {
      switch (attachment.__typename) {
        case 'PublicationMetadataMediaImage':
          return {
            uri: attachment.image.optimized?.uri,
            type: 'Image'
          };
        case 'PublicationMetadataMediaVideo':
          return {
            uri: attachment.video.optimized?.uri,
            type: 'Video'
          };
        case 'PublicationMetadataMediaAudio':
          return {
            uri: attachment.audio.optimized?.uri,
            type: 'Audio'
          };
        default:
          return [];
      }
    });
  };

  const getPublicationData = (): {
    content?: string;
    asset?: {
      uri: string;
      type: 'Image' | 'Video' | 'Audio';
    };
    attachments?: {
      uri: string;
      type: 'Image' | 'Video' | 'Audio';
    }[];
  } | null => {
    switch (metadataType) {
      case 'ArticleMetadataV3':
        return {
          content: metadata.content,
          attachments: getAttachmentsData(metadata.attachments)
        };
      case 'TextOnlyMetadataV3':
        return {
          content: metadata.content
        };
      case 'ImageMetadataV3':
        return {
          content: metadata.content,
          asset: {
            uri: metadata.asset.image.optimized?.uri,
            type: 'Image'
          },
          attachments: getAttachmentsData(metadata.attachments)
        };
      case 'AudioMetadataV3':
        return {
          content: metadata.content,
          asset: {
            uri: metadata.asset.audio.optimized?.uri,
            type: 'Audio'
          }
        };
      case 'VideoMetadataV3':
        return {
          content: metadata.content,
          asset: {
            uri: metadata.asset.video.optimized?.uri,
            type: 'Video'
          },
          attachments: getAttachmentsData(metadata.attachments)
        };
      default:
        return null;
    }
  };

  const filteredContent = getPublicationData()?.content || '';
  const filteredAttachments = getPublicationData()?.attachments || [];
  const filteredAsset = getPublicationData()?.asset;

  const canShowMore = filteredContent?.length > 450 && showMore;
  const urls = getURLs(filteredContent);
  const hasURLs = urls.length > 0;
  const snapshotProposalId = getSnapshotProposalId(urls);
  const nft = getNft(urls);

  const filterId = snapshotProposalId;
  let rawContent = filteredContent;

  if (filterId) {
    for (const url of urls) {
      if (url.includes(filterId)) {
        rawContent = rawContent.replace(url, '');
      }
    }
  }

  const [content, setContent] = useState(rawContent);

  if (!filteredContent) {
    return <i>Content not supported!</i>;
  }

  // Show NFT if it's there
  const showNft = nft;
  // Show snapshot if it's there
  const showSnapshot = snapshotProposalId;
  // Show attachments if it's there
  const showAttachments = filteredAttachments.length > 0 || filteredAsset;
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
        <Attachments attachments={filteredAttachments} asset={filteredAsset} />
      ) : null}
      {/* Open actions */}
      {/* {showSnapshot ? <Snapshot proposalId={snapshotProposalId} /> : null}
      {showNft ? <Nft nftMetadata={nft} publication={publication} /> : null}
      {showOembed ? (
        <Oembed
          url={urls[0]}
          publicationId={publication.id}
          onData={onOembedData}
        />
      ) : null} */}
      {targetPublication.__typename === 'Quote' && (
        <Quote publication={targetPublication.quoteOn} />
      )}
    </div>
  );
};

export default PublicationBody;
