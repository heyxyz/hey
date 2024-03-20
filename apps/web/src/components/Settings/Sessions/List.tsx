import type { ApprovedAuthenticationRequest } from '@hey/lens';
import type { FC } from 'react';

import Loader from '@components/Shared/Loader';
import { ComputerDesktopIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { Errors } from '@hey/data';
import { SETTINGS } from '@hey/data/tracking';
import {
  LimitType,
  useApprovedAuthenticationsQuery,
  useRevokeAuthenticationMutation
} from '@hey/lens';
import formatDate from '@hey/lib/datetime/formatDate';
import { Button, EmptyState, ErrorMessage } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { Leafwatch } from '@lib/leafwatch';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Virtuoso } from 'react-virtuoso';
import { useProfileRestriction } from 'src/store/non-persisted/useProfileRestriction';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

const List: FC = () => {
  const { currentProfile } = useProfileStore();
  const { isSuspended } = useProfileRestriction();
  const [revoking, setRevoking] = useState(false);
  const [revokeingSessionId, setRevokeingSessionId] = useState<null | string>(
    null
  );

  const onError = (error: any) => {
    setRevoking(false);
    setRevokeingSessionId(null);
    errorToast(error);
  };

  const onCompleted = () => {
    setRevoking(false);
    setRevokeingSessionId(null);
    Leafwatch.track(SETTINGS.SESSIONS.REVOKE);
    toast.success('Session revoked successfully!');
  };

  const [revokeAuthentication] = useRevokeAuthenticationMutation({
    onCompleted,
    onError,
    update: (cache) => {
      cache.evict({ id: 'ROOT_QUERY' });
    }
  });

  const revoke = async (authorizationId: string) => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setRevoking(true);
      setRevokeingSessionId(authorizationId);

      return await revokeAuthentication({
        variables: { request: { authorizationId } }
      });
    } catch (error) {
      onError(error);
    }
  };

  const request: ApprovedAuthenticationRequest = {
    limit: LimitType.TwentyFive
  };
  const { data, error, fetchMore, loading } = useApprovedAuthenticationsQuery({
    skip: !currentProfile?.id,
    variables: { request }
  });

  const approvedAuthentications = data?.approvedAuthentications?.items;
  const pageInfo = data?.approvedAuthentications?.pageInfo;
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
    return <Loader className="pb-5" />;
  }

  if (error) {
    return <ErrorMessage error={error} title="Failed to load sessions" />;
  }

  if (approvedAuthentications?.length === 0) {
    return (
      <EmptyState
        hideCard
        icon={<GlobeAltIcon className="size-8" />}
        message="You are not logged in on any other devices!"
      />
    );
  }

  return (
    <Virtuoso
      className="virtual-divider-list-window"
      computeItemKey={(_, session) => session.authorizationId}
      data={approvedAuthentications}
      endReached={onEndReached}
      itemContent={(_, session) => {
        return (
          <div className="flex flex-wrap items-start justify-between p-5">
            <div>
              <div className="mb-3 flex items-center space-x-2">
                <ComputerDesktopIcon className="size-8" />
                <div>
                  {session.browser ? <span>{session.browser}</span> : null}
                  {session.os ? <span> - {session.os}</span> : null}
                </div>
              </div>
              <div className="ld-text-gray-500 space-y-1 text-sm">
                {session.origin ? (
                  <div>
                    <b>Origin -</b> {session.origin}
                  </div>
                ) : null}
                <div>
                  <b>Registered -</b>{' '}
                  {formatDate(session.createdAt, 'MMM D, YYYY - hh:mm:ss A')}
                </div>
                <div>
                  <b>Last accessed -</b>{' '}
                  {formatDate(session.updatedAt, 'MMM D, YYYY - hh:mm:ss A')}
                </div>
                <div>
                  <b>Expires at -</b>{' '}
                  {formatDate(session.expiresAt, 'MMM D, YYYY - hh:mm:ss A')}
                </div>
              </div>
            </div>
            <Button
              disabled={
                revoking && revokeingSessionId === session.authorizationId
              }
              onClick={() => revoke(session.authorizationId)}
            >
              Revoke
            </Button>
          </div>
        );
      }}
      useWindowScroll
    />
  );
};

export default List;
