import type { FC, ReactNode } from 'react';

import humanize from '@hey/lib/humanize';
import { Card } from '@hey/ui';

interface NumberedStatsProps {
  action?: ReactNode;
  count: string;
  name: string;
  suffix?: string;
}

const NumberedStat: FC<NumberedStatsProps> = ({
  action,
  count,
  name,
  suffix
}) => {
  return (
    <Card className="p-5" forceRounded>
      <div className="flex items-center space-x-5">
        <div>{name}</div>
        {action && <div>{action}</div>}
      </div>
      <div className="text-xl font-bold tracking-wide">
        {humanize(parseInt(count))} <span className="text-sm">{suffix}</span>
      </div>
    </Card>
  );
};

export default NumberedStat;
