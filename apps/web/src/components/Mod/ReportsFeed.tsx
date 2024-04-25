import type {
  AnyPublication,
  MirrorablePublication,
  ModReportsRequest,
  Profile
} from '@hey/lens';
import type { FC } from 'react';

import GardenerActions from '@components/Publication/Actions/GardenerActions';
import SinglePublication from '@components/Publication/SinglePublication';
import PublicationsShimmer from '@components/Shared/Shimmer/PublicationsShimmer';
import SmallUserProfile from '@components/Shared/SmallUserProfile';
import { FlagIcon } from '@heroicons/react/24/outline';
import { LimitType, useModLatestReportsQuery } from '@hey/lens';
import formatDate from '@hey/lib/datetime/formatDate';
import { Card, EmptyState, ErrorMessage } from '@hey/ui';
import { Virtuoso } from 'react-virtuoso';

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
            <div>
              <div className="divider" />
              <div className="m-5">
                <GardenerActions
                  publication={
                    report.reportedPublication as MirrorablePublication
                  }
                />
              </div>
              <div className="divider" />
              <div className="m-5">
                <div>
                  <b>Reason:</b> {report.reason}
                </div>
                <div>
                  <b>Subreason:</b> {report.subreason}
                </div>
                {report.additionalInfo ? (
                  <div className="line-clamp-1" title={report.additionalInfo}>
                    <b>Additional info:</b> {report.additionalInfo}
                  </div>
                ) : null}
                <div>
                  <b>Reported at:</b>{' '}
                  {formatDate(report.createdAt, 'MMM D, YYYY - hh:mm:ss A')}
                </div>
                <div className="mt-2">
                  <SmallUserProfile profile={report.reporter as Profile} />
                </div>
              </div>
            </div>
          </Card>
        );
      }}
      useWindowScroll
    />
  );
};

export default ReportsFeed;
