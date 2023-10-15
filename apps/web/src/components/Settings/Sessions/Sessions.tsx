import { ComputerDesktopIcon } from '@heroicons/react/24/outline';
import { SETTINGS } from '@hey/data/tracking';
import type { ApprovedAuthentication } from '@hey/lens';
import { useRevokeAuthenticationMutation } from '@hey/lens';
import { Button, Card } from '@hey/ui';
import cn from '@hey/ui/cn';
import errorToast from '@lib/errorToast';
import { formatDate } from '@lib/formatTime';
import getCurrentSessionId from '@lib/getCurrentSessionId';
import { Leafwatch } from '@lib/leafwatch';
import type { FC } from 'react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface SessionsProps {
  sessions?: ApprovedAuthentication[];
}

const Sessions: FC<SessionsProps> = ({ sessions }) => {
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

  if (!sessions) {
    return null;
  }

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

  return (
    <div className="space-y-4 px-5 pb-5">
      {sessions?.map((session) => {
        const currentSession =
          session.authorizationId === getCurrentSessionId();

        return (
          <Card
            key={session.authorizationId}
            className="flex flex-wrap items-start justify-between p-5"
            forceRounded
          >
            <div>
              <div className="mb-3 flex items-center space-x-2">
                <ComputerDesktopIcon
                  className={cn(currentSession && 'text-green-500', 'h-8 w-8')}
                />
                <div>
                  {session.browser ? <span>{session.browser}</span> : null}
                  {session.os ? <span> - {session.os}</span> : null}
                </div>
              </div>
              <div className="lt-text-gray-500 space-y-1 text-sm">
                {session.origin ? (
                  <div>
                    <b>Origin -</b> {session.origin}
                  </div>
                ) : null}
                <div>
                  <b>Registered -</b>{' '}
                  {formatDate(session.createdAt, 'MMM D, YYYY - hh:mm A')}
                </div>
                <div>
                  <b>Last accessed -</b>{' '}
                  {formatDate(session.updatedAt, 'MMM D, YYYY - hh:mm A')}
                </div>
                <div>
                  <b>Expires at -</b>{' '}
                  {formatDate(session.expiresAt, 'MMM D, YYYY - hh:mm A')}
                </div>
              </div>
            </div>
            <Button
              variant="danger"
              disabled={
                (revoking && revokeingSessionId === session.authorizationId) ||
                currentSession
              }
              onClick={() => revoke(session.authorizationId)}
            >
              Revoke
            </Button>
          </Card>
        );
      })}
    </div>
  );
};

export default Sessions;
