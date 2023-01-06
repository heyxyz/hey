import Loader from '@components/Shared/Loader';
import { ErrorMessage } from '@components/UI/ErrorMessage';
import HelpTooltip from '@components/UI/HelpTooltip';
import type { LensterPublication } from '@generated/types';
import humanize from '@lib/humanize';
import { t } from '@lingui/macro';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { ERROR_MESSAGE, SIMPLEANALYTICS_API } from 'data/constants';
import type { FC } from 'react';

const Stat: FC<{ title: string; helper: string; stat: number }> = ({ title, helper, stat }) => (
  <>
    <span className="text-sm lt-text-gray-500 font-bold flex items-center space-x-1">
      <span>{title}</span>
      <HelpTooltip content={helper} />
    </span>
    <span className="text-2xl font-bold">{humanize(stat ?? 0)}</span>
  </>
);

interface Props {
  publication: LensterPublication;
}

const Stats: FC<Props> = ({ publication }) => {
  const getStats = async () => {
    const response = await axios(SIMPLEANALYTICS_API, {
      params: { version: 5, fields: 'pageviews', info: false, page: `/posts/${publication.id}` }
    });

    return response.data;
  };

  const { data, isLoading, error } = useQuery(['statsData'], () => getStats().then((res) => res));

  if (error) {
    return <ErrorMessage className="m-5" title={ERROR_MESSAGE} error={error as any} />;
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
