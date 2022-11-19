import Loader from '@components/Shared/Loader';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import HelpTooltip from '@components/UI/HelpTooltip';
import type { LensterPublication } from '@generated/lenstertypes';
import humanize from '@lib/humanize';
import axios from 'axios';
import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { ERROR_MESSAGE, SERVERLESS_URL } from 'src/constants';

const Stat: FC<{ title: string; helper: string; stat: number }> = ({ title, helper, stat }) => (
  <div className="">
    <span className="text-sm text-gray-500 font-bold flex items-center space-x-1">
      <span>{title}</span>
      <HelpTooltip content={helper} />
    </span>
    <span className="text-2xl font-bold">{humanize(stat ?? 0)}</span>
  </div>
);

interface Props {
  publication: LensterPublication;
}

const Stats: FC<Props> = ({ publication }) => {
  const [statsData, setStatsData] = useState<any>();
  const [error, setError] = useState<any>();

  const getStats = async () => {
    try {
      const response = await axios(`${SERVERLESS_URL}/api/analytics/publication`, {
        method: 'GET',
        params: { id: publication.id }
      });

      setStatsData(response.data);
    } catch (error: any) {
      setError(error);
    }
  };

  useEffect(() => {
    getStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publication]);

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        title={ERROR_MESSAGE}
        error={{ message: error.message, name: ERROR_MESSAGE }}
      />
    );
  }

  if (!statsData) {
    return <Loader message="Loading analytics" />;
  }

  return (
    <div className="p-5">
      <Stat
        title="Views"
        helper="Times people viewed the details about this publication"
        stat={statsData?.response?.views}
      />
    </div>
  );
};

export default Stats;
