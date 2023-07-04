import { useQueryAllTimeStats } from '@components/Publication/Actions/Tip/QuadraticQueries/grantsQueries';
import { t, Trans } from '@lingui/macro';
import { Card } from 'ui';

const AllTimeStatsItem = ({ title, value }: { title: string; value: string | number }) => (
  <div className="flex w-full">
    <div className="lt-text-gray-500 text-sm">{title}</div>
    <div className="ml-auto font-extrabold">{value}</div>
  </div>
);

export const AllTimeStats = () => {
  const { data: allTimeStats } = useQueryAllTimeStats();

  return (
    <Card className="p-4">
      <div className="text-md mb-4 font-bold uppercase">
        <Trans>all time stats</Trans>
      </div>
      {allTimeStats && (
        <div className="space-y-1">
          <AllTimeStatsItem title={t`Total rounds`} value={allTimeStats.numberOfRounds} />
          <AllTimeStatsItem title={t`Received over all rounds`} value={allTimeStats.totalTipped} />
          <AllTimeStatsItem title={t`Matched over all rounds`} value={allTimeStats.totalMatched} />
          <AllTimeStatsItem title={t`Tippers over all rounds`} value={allTimeStats.totalTippers} />
        </div>
      )}
    </Card>
  );
};
