import SinglePost from "@components/Post/SinglePost";
import Loader from "@components/Shared/Loader";
import { FlagIcon } from "@heroicons/react/24/outline";
import type { AnyPost } from "@hey/indexer";
import { Card, EmptyState, ErrorMessage } from "@hey/ui";
import type { FC } from "react";
import { Virtuoso } from "react-virtuoso";
import ReportDetails from "./ReportDetails";

interface ReportsProps {
  address?: string;
  postId?: string;
}

const Reports: FC<ReportsProps> = ({ address, postId }) => {
  const request: ModReportsRequest = {
    ...(address && { forProfile: address }),
    ...(postId && { forPublication: postId }),
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

  if (reports?.length === 0) {
    return (
      <EmptyState
        icon={<FlagIcon className="size-8" />}
        message="No reports yet!"
        className="my-5"
        hideCard
      />
    );
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
        data={reports?.filter((report) => report.reportedPublication)}
        endReached={onEndReached}
        itemContent={(_, report) => (
          <Card>
            <SinglePost
              isFirst
              post={report.reportedPublication as AnyPost}
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
