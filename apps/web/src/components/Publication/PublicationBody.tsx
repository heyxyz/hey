import Attachments from '@components/Shared/Attachments';
import IFramely from '@components/Shared/IFramely';
import Markup from '@components/Shared/Markup';
import Snapshot from '@components/Shared/Snapshot';
import { EyeIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import clsx from 'clsx';
import type { Publication } from 'lens';
import getSnapshotProposalId from 'lib/getSnapshotProposalId';
import getURLs from 'lib/getURLs';
import Link from 'next/link';
import { useRouter } from 'next/router';
import type { FC } from 'react';

import DecryptedPublicationBody from './DecryptedPublicationBody';

interface PublicationBodyProps {
  publication: Publication;
}

const PublicationBody: FC<PublicationBodyProps> = ({ publication }) => {
  const { pathname } = useRouter();
  const showMore =
    publication?.metadata?.content?.length > 450 && pathname !== '/posts/[id]';
  const hasURLs = getURLs(publication?.metadata?.content)?.length > 0;
  const snapshotProposalId =
    hasURLs && getSnapshotProposalId(getURLs(publication?.metadata?.content));
  let content = publication?.metadata?.content;
  if (snapshotProposalId) {
    for (const url of getURLs(publication?.metadata?.content)) {
      if (url.includes(snapshotProposalId)) {
        content = content?.replace(url, '');
      }
    }
  }

  if (publication?.metadata?.encryptionParams) {
    return <DecryptedPublicationBody encryptedPublication={publication} />;
  }

  const showAttachments = publication?.metadata?.media?.length > 0;
  const showSnapshot = snapshotProposalId;
  const showIFramely = hasURLs && !showAttachments && !showSnapshot;

  return (
    <div className="break-words">
      <Markup
        className={clsx(
          { 'line-clamp-5': showMore },
          'markup linkify text-md break-words'
        )}
      >
        {content}
      </Markup>
      {showMore && (
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
      {showSnapshot ? <Snapshot propsalId={snapshotProposalId} /> : null}
      {showIFramely ? (
        <IFramely url={getURLs(publication?.metadata?.content)[0]} />
      ) : null}
    </div>
  );
};

export default PublicationBody;
