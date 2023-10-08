import Markup from '@components/Shared/Markup';
import { EyeIcon } from '@heroicons/react/24/outline';
import type { AnyPublication } from '@hey/lens';
import { isMirrorPublication } from '@hey/lib/publicationHelpers';
import cn from '@hey/ui/cn';
import { Trans } from '@lingui/macro';
import Link from 'next/link';
import type { FC } from 'react';

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
  // const canShowMore = metadata?.content?.length > 450 && showMore;
  const canShowMore = false;
  // const urls = getURLs(metadata?.content);
  // const hasURLs = urls.length > 0;
  // const snapshotProposalId = getSnapshotProposalId(urls);
  // const nft = getNft(urls);

  // const filterId = snapshotProposalId;
  // let rawContent = metadata?.content;

  // if (filterId) {
  //   for (const url of urls) {
  //     if (url.includes(filterId)) {
  //       rawContent = rawContent?.replace(url, '');
  //     }
  //   }
  // }

  // const [content, setContent] = useState(rawContent);

  // // Show NFT if it's there
  // const showNft = nft;
  // // Show snapshot if it's there
  // const showSnapshot = snapshotProposalId;
  // // Show attachments if it's there
  // const showAttachments = metadata?.media?.length > 0;
  // // Show quoted publication if it's there
  // const showQuotedPublication = quotedPublicationId && !quoted;
  // // Show oembed if no NFT, no attachments, no snapshot, no quoted publication
  // const showOembed =
  //   hasURLs &&
  //   !showNft &&
  //   !showAttachments &&
  //   !showSnapshot &&
  //   !showQuotedPublication &&
  //   !quoted;

  // Remove URL at the end if oembed is there
  // const onOembedData = (data: OG) => {
  //   if (showOembed && data?.title) {
  //     const updatedContent = removeUrlAtEnd(urls, content);
  //     if (updatedContent !== content) {
  //       setContent(updatedContent);
  //     }
  //   }
  // };

  return (
    <div className="break-words">
      <Markup
        className={cn(
          { 'line-clamp-5': canShowMore },
          'markup linkify text-md break-words'
        )}
      >
        gm
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
      {/* {showAttachments ? (
        <Attachments attachments={metadata?.media} publication={publication} />
      ) : null} */}
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
      {/* {showQuotedPublication ? (
        <Quote publicationId={quotedPublicationId} />
      ) : null} */}
    </div>
  );
};

export default PublicationBody;
