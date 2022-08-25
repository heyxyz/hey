import Attachments from '@components/Shared/Attachments';
import IFramely from '@components/Shared/IFramely';
import Markup from '@components/Shared/Markup';
import CrowdfundShimmer from '@components/Shared/Shimmer/CrowdfundShimmer';
import { LensterPublication } from '@generated/lenstertypes';
import { EyeIcon } from '@heroicons/react/outline';
import getURLs from '@lib/getURLs';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { FC } from 'react';

const Crowdfund = dynamic(() => import('./Crowdfund'), {
  loading: () => <CrowdfundShimmer />
});

interface Props {
  publication: LensterPublication;
}

const PublicationBody: FC<Props> = ({ publication }) => {
  const { pathname } = useRouter();
  const publicationType = publication?.metadata?.attributes[0]?.value;
  const showMore = publication?.metadata?.content?.length > 450 && pathname !== '/posts/[id]';

  return (
    <div className="break-words">
      {publicationType === 'crowdfund' ? (
        <Crowdfund fund={publication} />
      ) : (
        <>
          <div
            className={clsx({
              'line-clamp-5': showMore
            })}
          >
            <div className="whitespace-pre-wrap break-words leading-md linkify text-md">
              <Markup>{publication?.metadata?.content}</Markup>
            </div>
          </div>
          {showMore && (
            <div className="mt-4 text-sm text-gray-500 font-bold flex items-center space-x-1">
              <EyeIcon className="h-4 w-4" />
              <span>Show more</span>
            </div>
          )}
        </>
      )}
      {publication?.metadata?.media?.length > 0 ? (
        <Attachments attachments={publication?.metadata?.media} />
      ) : (
        publication?.metadata?.content &&
        publicationType !== 'crowdfund' &&
        getURLs(publication?.metadata?.content)?.length > 0 && (
          <IFramely url={getURLs(publication?.metadata?.content)[0]} />
        )
      )}
    </div>
  );
};

export default PublicationBody;
