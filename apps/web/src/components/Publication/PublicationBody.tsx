import Attachments from '@components/Shared/Attachments';
import Profile from '@components/Shared/Embed/Publication';
import Markup from '@components/Shared/Markup';
import Oembed from '@components/Shared/Oembed';
import Snapshot from '@components/Shared/Snapshot';
import { EyeIcon } from '@heroicons/react/outline';
import type { Publication } from '@lenster/lens';
import getLensPublicationIdsFromUrls from '@lenster/lib/getLensPublicationIdsFromUrls';
import getSnapshotProposalId from '@lenster/lib/getSnapshotProposalId';
import getURLs from '@lenster/lib/getURLs';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import Link from 'next/link';
import type { FC } from 'react';

import DecryptedPublicationBody from './DecryptedPublicationBody';

interface PublicationBodyProps {
  publication: Publication;
  showMore?: boolean;
}

const PublicationBody: FC<PublicationBodyProps> = ({
  publication,
  showMore = false
}) => {
  const canShowMore = publication?.metadata?.content?.length > 450 && showMore;
  const urls = getURLs(publication?.metadata?.content);
  const hasURLs = urls?.length > 0;
  const snapshotProposalId = hasURLs && getSnapshotProposalId(urls);
  const renderPublications = getLensPublicationIdsFromUrls(urls);

  let content = publication?.metadata?.content;
  const filterId =
    snapshotProposalId ||
    (renderPublications.length > 0 && renderPublications[0]);

  if (filterId) {
    for (const url of urls) {
      if (url.includes(filterId)) {
        content = content?.replace(url, '');
      }
    }
  }

  if (publication?.metadata?.encryptionParams) {
    return <DecryptedPublicationBody encryptedPublication={publication} />;
  }

  const showAttachments = publication?.metadata?.media?.length > 0;
  const showSnapshot = snapshotProposalId;
  const showPublicationEmbed = renderPublications.length > 0;
  const showOembed =
    hasURLs && !showAttachments && !showSnapshot && !showPublicationEmbed;

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
          <Link href={`/posts/${publication?.id}`}>
            <Trans>Show more</Trans>
          </Link>
        </div>
      )}
      {/* Snapshot, Attachments and Opengraph */}
      {showAttachments ? (
        <Attachments
          attachments={publication?.metadata?.media}
          publication={publication}
        />
      ) : null}
      {showPublicationEmbed ? (
        <Profile publicationIds={renderPublications} />
      ) : null}
      {showSnapshot ? <Snapshot proposalId={snapshotProposalId} /> : null}
      {showOembed ? <Oembed url={urls[0]} /> : null}
    </div>
  );
};

export default PublicationBody;
