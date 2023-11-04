import Loader from '@components/Shared/Loader';
import { ComputerDesktopIcon, GlobeAltIcon } from '@heroicons/react/24/outline';
import { SETTINGS } from '@hey/data/tracking';
import type { ApprovedAuthenticationRequest } from '@hey/lens';
import {
  LimitType,
  useApprovedAuthenticationsQuery,
  useRevokeAuthenticationMutation
} from '@hey/lens';
import { Button, Card, EmptyState, ErrorMessage } from '@hey/ui';
import errorToast from '@lib/errorToast';
import { formatDate } from '@lib/formatTime';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useState } from 'react';
import { useInView } from 'react-cool-inview';
import toast from 'react-hot-toast';
import { useAppStore } from 'src/store/useAppStore';

const List: FC = () => {
  const currentProfile = useAppStore((state) => state.currentProfile);

  const [revoking, setRevoking] = useState(false);
  const [revokeingSessionId, setRevokeingSessionId] = useState<string | null>(
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
  const { data, loading, error, fetchMore } = useApprovedAuthenticationsQuery({
    variables: { request },
    skip: !currentProfile?.id
  });

  const approvedAuthentications = data?.approvedAuthentications?.items;
  const pageInfo = data?.approvedAuthentications?.pageInfo;
  const hasMore = pageInfo?.next;

  const { observe } = useInView({
    onChange: async ({ inView }) => {
      if (!inView || !hasMore) {
        return;
      }

      return await fetchMore({
        variables: { request: { ...request, cursor: pageInfo?.next } }
      });
    }
  });

  if (loading) {
    return (
      <div className="pb-5">
        <Loader />
      </div>
    );
  }

  if (error) {
    return <ErrorMessage title="Failed to load sessions" error={error} />;
  }

  if (approvedAuthentications?.length === 0) {
    return (
      <EmptyState
        message="You are not logged in on any other devices!"
        icon={<GlobeAltIcon className="text-brand-500 h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="space-y-4">
      {approvedAuthentications?.map((session) => (
        <Card
          key={session.authorizationId}
          className="flex flex-wrap items-start justify-between p-5"
          forceRounded
        >
          <div>
            <div className="mb-3 flex items-center space-x-2">
              <ComputerDesktopIcon className="h-8 w-8" />
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
            variant="danger"
            disabled={
              revoking && revokeingSessionId === session.authorizationId
            }
            onClick={() => revoke(session.authorizationId)}
          >
            Revoke
          </Button>
        </Card>
      ))}
      {hasMore ? <span ref={observe} /> : null}
    </div>
  );
};

export default List;
