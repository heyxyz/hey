import type { AnyPublication, ModReport, ModReportsRequest } from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import { FlagIcon } from '@heroicons/react/24/outline';
import { LimitType, useModLatestReportsQuery } from '@hey/lens';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { Virtuoso } from 'react-virtuoso';

import ReportDetails from './ReportDetails';

const ReportsFeed: FC = () => {
  // Variables
  const request: ModReportsRequest = { limit: LimitType.Fifty };

  const { data, error, fetchMore, loading } = useModLatestReportsQuery({
    variables: { request }
  });

  const reports = data?.modLatestReports?.items;
  const pageInfo = data?.modLatestReports?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (!hasMore) {
      return;
    }

    return await fetchMore({
      variables: { request: { ...request, cursor: pageInfo?.next } }
    });
  };

  if (loading) {
    return <PublicationsShimmer />;
  }

  if (reports?.length === 0) {
    return (
      <EmptyState
        icon={<FlagIcon className="size-8" />}
        message="No reports yet!"
      />
    );
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load reports feed" />;
  }

  return (
    <Virtuoso
      className="[&>div>div]:space-y-5"
      components={{ Footer: () => <div className="pb-5" /> }}
      computeItemKey={(index, report) =>
        `${report.reporter.id}-${report.reportedPublication?.id}-${index}`
      }
      data={reports}
      endReached={onEndReached}
      itemContent={(index, report) => {
        return (
          <Card>
            <SinglePublication
              isFirst
              isLast={false}
              publication={report.reportedPublication as AnyPublication}
              showActions={false}
              showThread={false}
            />
            <div className="divider" />
            <ReportDetails report={report as ModReport} />
          </Card>
        );
      }}
      useWindowScroll
    />
  );
};

export default ReportsFeed;
