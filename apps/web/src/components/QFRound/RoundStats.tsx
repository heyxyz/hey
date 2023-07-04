import type {
  RoundMetaData,
  RoundStats as RoundStatsType
} from '@components/Publication/Actions/Tip/QuadraticQueries/grantsQueries';
import PublicationRow from '@components/QFRound/PublicationRow';
import { t, Trans } from '@lingui/macro';
import { Card } from 'ui';

const Item = ({ title, value }: { title: string; value: string | number }) => (
  <div className="mb-2 flex basis-1/4 flex-col">
    <div className="lt-text-gray-500 text-sm">{title}</div>
    <div className="font-extrabold">{value}</div>
  </div>
);

const numberOfPopularPosts = 5;

export const RoundStats = ({
  stats,
  metaData
}: {
  roundId: string;
  stats: RoundStatsType;
  metaData: RoundMetaData;
}) => {
  const mostPopularPosts = stats.posts.slice(0, numberOfPopularPosts);
  const otherPosts = stats.posts.slice(numberOfPopularPosts);

  const endTime = new Date(stats.roundEndTime * 1000).toLocaleString();

  return (
    <div className="">
      <div className="mb-4 text-2xl font-extrabold uppercase">{metaData?.name || 'Loading...'}</div>
      {metaData?.description && <div className="mb-4">{metaData.description}</div>}
      <div className="flex w-full flex-wrap">
        <Item title={t`Total of all tips`} value={`$ ${stats.totalTipped}`} />
        <Item title={t`Total match`} value={`$ ${stats.totalMatched}`} />
        <Item title={t`Posts receiving tips`} value={stats.uniqueTippedPosts} />
        <Item title={t`Unique tippers`} value={stats.uniqueTippers} />
        <Item title={t`Average tip`} value={`$ ${stats.averageTip}`} />
        <Item title={t`Average tips per post`} value={stats.averageTipsPerPost} />
        <Item title={t`Round end`} value={endTime} />
      </div>
      {!!stats.posts.length && (
        <div className="mt-4 space-y-4">
          {!!mostPopularPosts.length && (
            <div className="mt-4">
              <div className="lt-text-gray-500 mb-2 text-sm">
                <Trans>Most popular posts in round</Trans>
              </div>
              <Card className="divide-y-[1px] dark:divide-gray-700">
                {mostPopularPosts.map(({ publicationId, uniqueContributors, totalTippedInToken }) => (
                  <PublicationRow
                    key={publicationId}
                    publicationId={publicationId}
                    totalTipped={totalTippedInToken}
                    uniqueContributors={uniqueContributors}
                  />
                ))}
              </Card>
            </div>
          )}
          {!!otherPosts.length && (
            <div>
              <div className="lt-text-gray-500 mb-2 text-sm">
                <Trans>All posts in this round ({otherPosts.length})</Trans>
              </div>
              <Card className="divide-y-[1px] dark:divide-gray-700">
                {otherPosts.map(({ publicationId, uniqueContributors, totalTippedInToken }) => (
                  <PublicationRow
                    key={publicationId}
                    publicationId={publicationId}
                    totalTipped={totalTippedInToken}
                    uniqueContributors={uniqueContributors}
                  />
                ))}
              </Card>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
