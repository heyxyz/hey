import type { AnyPublication, ModReport, ModReportsRequest } from '@hey/lens';
import type { FC } from 'react';

import SinglePublication from '@components/Publication/SinglePublication';
import Loader from '@components/Shared/Loader';
import { LimitType, useModLatestReportsQuery } from '@hey/lens';
import { Card, ErrorMessage } from '@hey/ui';
import { Virtuoso } from 'react-virtuoso';

import ReportDetails from './ReportDetails';

interface ReportsProps {
  profileId?: string;
  publicationId?: string;
}

const Reports: FC<ReportsProps> = ({ profileId, publicationId }) => {
  const request: ModReportsRequest = {
    ...(profileId && { forProfile: profileId }),
    ...(publicationId && { forPublication: publicationId }),
    limit: LimitType.Fifty
  };

  const { data, error, fetchMore, loading } = useModLatestReportsQuery({
    variables: { request }
  });

  const reports = data?.modLatestReports?.items;
  const pageInfo = data?.modLatestReports?.pageInfo;
  const hasMore = pageInfo?.next;

  const onEndReached = async () => {
    if (hasMore) {
      await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  };

  if (loading) {
    return <Loader className="my-10" message="Loading reports..." />;
  }

  if (error) {
    return (
      <ErrorMessage
        className="m-5"
        error={error}
        title="Failed to load reports"
      />
    );
  }

  return (
    <div className="max-h-[80vh] overflow-y-auto">
      <Virtuoso
        className="!h-[80vh] [&>div>div]:space-y-5 [&>div>div]:px-5 [&>div]:py-5"
        components={{ Footer: () => <div className="pb-5" /> }}
        computeItemKey={(index, report) =>
          `${report.reporter.id}-${report.reportedPublication?.id}-${index}`
        }
        data={reports}
        endReached={onEndReached}
        itemContent={(_, report) => (
          <Card>
            <SinglePublication
              isFirst
              publication={report.reportedPublication as AnyPublication}
              showActions={false}
              showThread={false}
            />
            <div className="divider" />
            <ReportDetails hideViewReportsButton report={report as ModReport} />
          </Card>
        )}
      />
    </div>
  );
};

export default Reports;
