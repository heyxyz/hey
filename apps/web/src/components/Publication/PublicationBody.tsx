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
  const showMore = publication?.metadata?.content?.length > 450 && pathname !== '/posts/[id]';
  const hasURLs = getURLs(publication?.metadata?.content)?.length > 0;
  const snapshotProposalId = hasURLs && getSnapshotProposalId(getURLs(publication?.metadata?.content)[0]);

  if (publication?.metadata?.encryptionParams) {
    return <DecryptedPublicationBody encryptedPublication={publication} />;
  }

  return (
    <div className="break-words">
      <Markup className={clsx({ 'line-clamp-5': showMore }, 'markup linkify text-md break-words')}>
        {publication?.metadata?.content}
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
      {snapshotProposalId ? (
        <Snapshot propsalId={snapshotProposalId} />
      ) : publication?.metadata?.media?.length > 0 ? (
        <Attachments attachments={publication?.metadata?.media} publication={publication} />
      ) : (
        publication?.metadata?.content &&
        hasURLs && <IFramely url={getURLs(publication?.metadata?.content)[0]} />
      )}
    </div>
  );
};

export default PublicationBody;
