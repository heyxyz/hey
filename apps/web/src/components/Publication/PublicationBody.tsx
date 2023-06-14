import Attachments from '@components/Shared/Attachments';
import Quote from '@components/Shared/Embed/Quote';
import Space from '@components/Shared/Embed/Space';
import Markup from '@components/Shared/Markup';
import Oembed from '@components/Shared/Oembed';
import Snapshot from '@components/Shared/Snapshot';
import { EyeIcon } from '@heroicons/react/outline';
import { FeatureFlag } from '@lenster/data';
import type { Publication } from '@lenster/lens';
import getPublicationAttribute from '@lenster/lib/getPublicationAttribute';
import getSnapshotProposalId from '@lenster/lib/getSnapshotProposalId';
import getURLs from '@lenster/lib/getURLs';
import { Growthbook } from '@lib/growthbook';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';
import type { SpaceMetadata } from 'src/types';

import DecryptedPublicationBody from './DecryptedPublicationBody';

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
  const { on: isSpacesEnabled } = Growthbook.feature(FeatureFlag.Spaces);
  const { id, metadata } = publication;
  const canShowMore = metadata?.content?.length > 450 && showMore;
  const urls = getURLs(metadata?.content);
  const hasURLs = urls?.length > 0;
  const snapshotProposalId = hasURLs && getSnapshotProposalId(urls);
  const quotedPublicationId = getPublicationAttribute(
    metadata.attributes,
    'quotedPublicationId'
  );
  const spaceObject = getPublicationAttribute(
    metadata.attributes,
    'audioSpace'
  );
  const space: SpaceMetadata = Boolean(spaceObject)
    ? JSON.parse(spaceObject)
    : null;

  let content = metadata?.content;
  const filterId = snapshotProposalId || quotedPublicationId;

  if (filterId) {
    for (const url of urls) {
      if (url.includes(filterId)) {
        content = content?.replace(url, '');
      }
    }
  }

  if (metadata?.encryptionParams) {
    return <DecryptedPublicationBody encryptedPublication={publication} />;
  }

  if (Boolean(space?.id) && isSpacesEnabled) {
    return <Space publication={publication} />;
  }

  const showAttachments = metadata?.media?.length > 0;
  const showSnapshot = snapshotProposalId;
  const showQuotedPublication = quotedPublicationId && !quoted;
  const showOembed =
    hasURLs &&
    !showAttachments &&
    !showSnapshot &&
    !showQuotedPublication &&
    !quoted;

  return (
    <div className="break-words">
      <Markup
        className={clsx(
          { 'line-clamp-5': canShowMore },
          'markup linkify text-md break-words'
        )}
      >
        {content}
      </Markup>
      {canShowMore && (
        <div className="lt-text-gray-500 mt-4 flex items-center space-x-1 text-sm font-bold">
          <EyeIcon className="h-4 w-4" />
          <Link href={`/posts/${id}`}>
            <Trans>Show more</Trans>
          </Link>
        </div>
      )}
      {/* Snapshot, Attachments and Opengraph */}
      {showAttachments ? (
        <Attachments attachments={metadata?.media} publication={publication} />
      ) : null}
      {showSnapshot ? <Snapshot proposalId={snapshotProposalId} /> : null}
      {showOembed ? <Oembed url={urls[0]} /> : null}
      {showQuotedPublication ? (
        <Quote publicationId={quotedPublicationId} />
      ) : null}
    </div>
  );
};

export default PublicationBody;
