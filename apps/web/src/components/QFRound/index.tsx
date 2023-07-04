import MetaTags from '@components/Common/MetaTags';
import {
  useGetRoundMetaDatas,
  useQueryQFRoundStats
} from '@components/Publication/Actions/Tip/QuadraticQueries/grantsQueries';
import { AllTimeStats } from '@components/QFRound/AllTimeStats';
import { RoundStats } from '@components/QFRound/RoundStats';
import Loading from '@components/Shared/Loading';
import { APP_NAME } from 'data';
import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { Card, GridItemEight, GridItemFour, GridLayout } from 'ui';

const ViewQFRound: NextPage = () => {
  const { data, isLoading, isError } = useQueryQFRoundStats();

  const roundMetaPtrs = Object.values(data?.roundStatsByRound || {}).map((stats) => stats.roundMetaPtr);

  const {
    data: metaDatas,
    isLoading: isLoadingMetaDatas,
    isError: isErrorMetaDatas
  } = useGetRoundMetaDatas(roundMetaPtrs);

  if (isError || isErrorMetaDatas) {
    return <Custom500 />;
  }

  if (isLoading || isLoadingMetaDatas) {
    return <Loading />;
  }

  if (!data || !metaDatas) {
    return <Custom404 />;
  }

  return (
    <GridLayout>
      <MetaTags title={`Quadratic Funding Rounds • ${APP_NAME}`} />
      <GridItemEight className="space-y-4">
        {Object.entries(data.roundStatsByRound).map(([roundId, stats]) => {
          const metaData = metaDatas[stats.roundMetaPtr];

          if (!metaData) {
            return null;
          }

          return (
            <Card key={roundId} className="p-4">
              <RoundStats roundId={roundId} stats={stats} metaData={metaData} />
            </Card>
          );
        })}
      </GridItemEight>
      <GridItemFour>
        <AllTimeStats />
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewQFRound;
