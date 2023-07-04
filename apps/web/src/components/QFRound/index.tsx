import MetaTags from '@components/Common/MetaTags';
import { useQueryAllTimeStats } from '@components/Publication/Actions/Tip/QuadraticQueries/grantsQueries';
import { AllTimeStats } from '@components/QFRound/AllTimeStats';
import { RoundStats } from '@components/QFRound/RoundStats';
import { APP_NAME } from 'data';
import type { NextPage } from 'next';
import Custom404 from 'src/pages/404';
import Custom500 from 'src/pages/500';
import { Card, GridItemEight, GridItemFour, GridLayout } from 'ui';

const ViewQFRound: NextPage = () => {
  const { data, isLoading, isError } = useQueryAllTimeStats();

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
        {Object.entries(data.roundStatsByRound).map(([roundId, stats]) => (
          <Card key={roundId} className="p-4">
            <RoundStats roundId={roundId} stats={stats} />
          </Card>
        ))}
      </GridItemEight>
      <GridItemFour>
        <AllTimeStats />
      </GridItemFour>
    </GridLayout>
  );
};

export default ViewQFRound;
