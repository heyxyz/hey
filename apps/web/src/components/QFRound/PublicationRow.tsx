import type { MatchingUpdateEntry } from '@components/Publication/Actions/Tip/QuadraticQueries/grantsQueries';
import { useGetRoundInfo } from '@components/Publication/Actions/Tip/QuadraticQueries/grantsQueries';
import SinglePublication from '@components/Publication/SinglePublication';
import { getTokenName } from '@components/utils/getTokenName';
import type { Publication } from 'lens';
import { usePublicationQuery } from 'lens';
import { useRouter } from 'next/router';
import React from 'react';
import { useAppStore } from 'src/store/app';
import { useChainId } from 'wagmi';

export const PublicationRow = ({
  publicationId,
  matchingUpdateEntry,
  roundAddress
}: {
  publicationId: string;
  roundAddress: string;
  matchingUpdateEntry?: MatchingUpdateEntry;
}) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const chainId = useChainId();
  const { data: roundInfo } = useGetRoundInfo(roundAddress);
  const { push } = useRouter();

  const { data, loading, error } = usePublicationQuery({
    variables: {
      request: { publicationId },
      profileId: currentProfile?.id ?? null
    },
    skip: !publicationId
  });

  if (error) {
    return null;
  }

  if (loading || !data?.publication) {
    return null;
  }

  const tokenName = getTokenName(roundInfo?.token, { id: chainId });

  return (
    <div
      className="cursor-pointer p-4  hover:bg-gray-100"
      onClick={() => {
        push(`/posts/${publicationId}`);
      }}
    >
      <SinglePublication
        showActions={false}
        showThread={false}
        publication={data.publication as Publication}
      />
      {!!(matchingUpdateEntry && roundInfo) && (
        <div className="font-grey-700 text-brand-600">
          {matchingUpdateEntry?.totalContributionsInToken} {tokenName} by{' '}
          {matchingUpdateEntry?.uniqueContributorsCount} tippers - receives{' '}
          {parseFloat((matchingUpdateEntry?.matchPoolPercentage * 100).toFixed(2))}% of matching funds (
          {matchingUpdateEntry.matchAmountInToken} {tokenName})
        </div>
      )}
    </div>
  );
};

export default PublicationRow;
