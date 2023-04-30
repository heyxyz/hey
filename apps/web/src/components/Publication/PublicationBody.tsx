import Attachments from '@components/Shared/Attachments';
import IFramely from '@components/Shared/IFramely';
import Markup from '@components/Shared/Markup';
import Snapshot from '@components/Shared/Snapshot';
import { EyeIcon } from '@heroicons/react/outline';
import { getPrimaryLanguage } from '@lib/i18n';
import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
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
  const { i18n } = useLingui();
  const showMore =
    publication?.metadata?.content?.length > 450 && pathname !== '/posts/[id]';
  const publicationLanguage: string = getPrimaryLanguage(
    publication?.metadata?.locale
  );
  const enableTranslate =
    publicationLanguage != getPrimaryLanguage(i18n.locale);
  const hasURLs = getURLs(publication?.metadata?.content)?.length > 0;
  const snapshotProposalId =
    hasURLs &&
    getSnapshotProposalId(getURLs(publication?.metadata?.content)[0]);
  let content = publication?.metadata?.content;
  if (snapshotProposalId) {
    content = content?.replace(getURLs(publication?.metadata?.content)[0], '');
  }

  if (publication?.metadata?.encryptionParams) {
    return <DecryptedPublicationBody encryptedPublication={publication} />;
  }

  const getGoogleTranslateUrl = (srcText: string): string => {
    const primaryLocale = getPrimaryLanguage(i18n.locale);
    const locale = primaryLocale === 'zh' ? 'zh-CN' : primaryLocale;
    const srcTextEnc = encodeURIComponent(srcText);
    return `https://translate.google.com/?sl=auto&tl=${locale}&text=${srcTextEnc}&op=translate`;
  };

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
      {snapshotProposalId ? (
        <Snapshot propsalId={snapshotProposalId} />
      ) : publication?.metadata?.media?.length > 0 ? (
        <Attachments
          attachments={publication?.metadata?.media}
          publication={publication}
        />
      ) : (
        publication?.metadata?.content &&
        hasURLs && <IFramely url={getURLs(publication?.metadata?.content)[0]} />
      )}
      {enableTranslate && (
        <div className="lt-text-gray-500 mt-4 flex items-center space-x-1 text-sm font-bold">
          <Link
            href={getGoogleTranslateUrl(publication?.metadata?.content)}
            target="_blank"
          >
            <Trans>🌐 Translate with Google Translate</Trans>
          </Link>
        </div>
      )}
    </div>
  );
};

export default PublicationBody;
