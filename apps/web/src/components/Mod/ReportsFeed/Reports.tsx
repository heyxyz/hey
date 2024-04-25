import type {
  MirrorablePublication,
  ModReport,
  ModReportsRequest
} from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { LimitType, useModLatestReportsQuery } from '@hey/lens';
import { Card, ErrorMessage } from '@hey/ui';
import { Virtuoso } from 'react-virtuoso';

import ReportDetails from './ReportDetails';

interface ReportsProps {
  publication: MirrorablePublication;
}

const Reports: FC<ReportsProps> = ({ publication }) => {
  // Variables
  const request: ModReportsRequest = {
    forPublication: publication.id,
    limit: LimitType.Fifty
  };

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
    return <Loader message="Loading reports..." />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load reports" />;
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
        itemContent={(index, report) => {
          return (
            <Card>
              <ReportDetails
                hideViewReportsButton
                report={report as ModReport}
              />
            </Card>
          );
        }}
      />
    </div>
  );
};

export default Reports;
