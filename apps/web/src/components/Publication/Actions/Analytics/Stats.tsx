import Loader from '@components/Shared/Loader';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { SIMPLEANALYTICS_API } from 'data/constants';
import Errors from 'data/errors';
import type { Publication } from 'lens';
import humanize from 'lib/humanize';
import type { FC } from 'react';
import { ErrorMessage, HelpTooltip } from 'ui';

const Stat: FC<{ title: string; helper: string; stat: number }> = ({ title, helper, stat }) => (
  <>
    <span className="lt-text-gray-500 flex items-center space-x-1 text-sm font-bold">
      <span>{title}</span>
      <HelpTooltip content={helper} />
    </span>
    <span className="text-2xl font-bold">{humanize(stat ?? 0)}</span>
  </>
);

interface StatsProps {
  publication: Publication;
}

const Stats: FC<StatsProps> = ({ publication }) => {
  const getStats = async () => {
    const response = await axios(SIMPLEANALYTICS_API, {
      params: { version: 5, fields: 'pageviews', info: false, page: `/posts/${publication.id}` }
    });

    return response.data;
  };

  const { data, isLoading, error } = useQuery(['statsData'], () => getStats().then((res) => res));

  if (error) {
    return <ErrorMessage className="m-5" title={Errors.SomethingWentWrong} error={error as any} />;
  }

  if (isLoading) {
    return <Loader message={t`Loading analytics`} />;
  }

  return (
    <div className="p-5">
      <Stat
        title={t`Views`}
        helper={t`Times people viewed the details about this publication`}
        stat={data?.pageviews}
      />
    </div>
  );
};

export default Stats;
