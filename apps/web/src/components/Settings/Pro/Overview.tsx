import type { FC } from 'react';

import ExtendButton from '@components/Pro/ExtendButton';
import { APP_NAME } from '@good/data/constants';
import getNumberOfDaysFromDate from '@good/helpers/datetime/getNumberOfDaysFromDate';
import { Card, CardHeader } from '@good/ui';
import { useProStore } from 'src/store/non-persisted/useProStore';

const getColor = (days: number) => {
  if (days < 7) {
    return 'text-red-500';
  }

  if (days < 14) {
    return 'text-orange-500';
  }

  return 'text-green-500';
};

const Overview: FC = () => {
  const { proExpiresAt } = useProStore();
  const daysLeft = getNumberOfDaysFromDate(proExpiresAt as Date);

  return (
    <Card>
      <CardHeader
        body={`Thanks for using ${APP_NAME} Pro!`}
        title={`${APP_NAME} Pro`}
      />
      <div className="m-5 space-y-3">
        <b>
          Your pro subscription expires in{' '}
          <span className={getColor(daysLeft)}>{daysLeft} days</span>
        </b>
        <div className="flex items-center space-x-5">
          <ExtendButton outline size="md" tier="monthly" />
          <ExtendButton outline size="md" tier="annually" />
        </div>
      </div>
    </Card>
  );
};

export default Overview;
