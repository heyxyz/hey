import MetaTags from '@components/Common/MetaTags';
import { useQueryRoundsOverview } from '@components/Publication/Actions/Tip/QuadraticQueries/grantsQueries';
import PublicationRow from '@components/QFRound/PublicationRow';
import { t, Trans } from '@lingui/macro';
import { APP_NAME } from 'data';
import type { NextPage } from 'next';
import { useMemo } from 'react';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { Card, GridItemEight, GridItemFour, GridLayout } from 'ui';

const Item = ({ title, value }: { title: string; value: string | number }) => (
  <div className="flex basis-1/4 flex-col">
    <div className="lt-text-gray-500 text-sm">{title}</div>
    <div className="font-extrabold">{value}</div>
  </div>
);

const AllTimeStatsItem = ({ title, value }: { title: string; value: string | number }) => (
  <div className="flex w-full">
    <div className="lt-text-gray-500 text-sm">{title}</div>
    <div className="ml-auto font-extrabold">{value}</div>
  </div>
);

const ViewQFRound: NextPage = () => {
  const { data, isError, isLoading } = useQueryRoundsOverview();

  const allTimeStats = useMemo(() => {
    if (isLoading || isError || !data) {
      return null;
    }

    return {
      numberOfRounds: data.length,
      totalTipped: data.reduce((acc, round) => acc + round.totalTips, 0),
      totalMatched: data.reduce((acc, round) => acc + round.totalPot, 0),
      totalTippers: data.reduce((acc, round) => acc + round.totalPot, 0)
    };
  }, [isLoading, isError, data]);

  if (isError) {
    return <Custom500 />;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Quadratic Funding Rounds • ${APP_NAME}`} />
      <GridItemEight className="space-y-4">
        <h1>QFRound</h1>
        {data.map((round) => (
          <div key={round.id} className="">
            <div className="mb-4 text-2xl font-extrabold uppercase">{round.name}</div>
            <div className="flex w-full pb-4">
              <Item title={t`Total of all tips`} value={`$ ${round.totalTips}`} />
              <Item title={t`Total match`} value={`$ ${round.totalPot}`} />
              <Item title={t`Posts receiving tips`} value={round.uniquePosts} />
              <Item title={t`Average tip`} value={`$ ${round.averageTip}`} />
              <Item title={t`Average tips per post`} value={round.averageTipsPerPost} />
            </div>
            <div className="space-y-4">
              {!!round.posts.length && (
                <div>
                  <div className="lt-text-gray-500 mb-2 text-sm">
                    <Trans>Most popular posts in round</Trans>
                  </div>
                  <Card className="divide-y-[1px] dark:divide-gray-700">
                    {round.posts.map(({ publicationId, totalTippedInToken, uniqueContributors }) => (
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
              {!!round.posts.length && (
                <div>
                  <div className="lt-text-gray-500 mb-2 text-sm">
                    <Trans>All posts in this round ({round.posts.length})</Trans>
                  </div>
                  <Card className="divide-y-[1px] dark:divide-gray-700">
                    {round.posts.map(({ publicationId, totalTippedInToken, uniqueContributors }) => (
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
          </div>
        ))}
      </GridItemEight>
      <GridItemFour>
        <Card className="p-4">
          <div className="text-md mb-4 font-bold uppercase">
            <Trans>all time stats</Trans>
          </div>
          {allTimeStats !== null && (
            <div className="space-y-1">
              <AllTimeStatsItem title={t`Total rounds`} value={allTimeStats.numberOfRounds} />
              <AllTimeStatsItem title={t`Received over all rounds`} value={allTimeStats.totalTipped} />
              <AllTimeStatsItem title={t`Matched over all rounds`} value={allTimeStats.totalMatched} />
              <AllTimeStatsItem title={t`Tippers over all rounds`} value={allTimeStats.totalTippers} />
            </div>
          )}
        </Card>
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewQFRound;
