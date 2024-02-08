import type { FC } from 'react';

import humanize from '@hey/lib/humanize';
import { Card } from '@hey/ui';

interface NumberedStatsProps {
  count: string;
  name: string;
  suffix?: string;
}

const NumberedStat: FC<NumberedStatsProps> = ({ count, name, suffix }) => {
  return (
    <Card className="p-5" forceRounded>
      <div>{name}</div>
      <div className="text-xl font-bold tracking-wide">
        {humanize(parseInt(count))} <span className="text-sm">{suffix}</span>
      </div>
    </Card>
  );
};

export default NumberedStat;
