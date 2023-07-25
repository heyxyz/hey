import Loader from '@components/Shared/Loader';
import { TicketIcon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { useInvitedQuery } from '@lenster/lens';
import formatAddress from '@lenster/lib/formatAddress';
import { EmptyState, ErrorMessage, Input } from '@lenster/ui';
import { formatDate } from '@lib/formatTime';
import { t, Trans } from '@lingui/macro';
import type { FC } from 'react';

const Invited: FC = () => {
  const { data, loading, error } = useInvitedQuery();

  if (loading) {
    return <Loader message={t`Loading invided addresses`} />;
  }

  if (error) {
    return (
      <ErrorMessage title={t`Failed to load invited addresses`} error={error} />
    );
  }

  if (data?.invited?.length === 0) {
    return (
      <EmptyState
        message={
          <div>
            <Trans>You haven't invited anyone.</Trans>
          </div>
        }
        icon={<TicketIcon className="text-brand h-8 w-8" />}
        hideCard
      />
    );
  }

  return (
    <div className="space-y-3">
      {data?.invited.map((invite, key) => (
        <div key={key}>
          <Input
            className="text-sm"
            iconLeft={<CheckCircleIcon className="text-brand h-5 w-5" />}
            value={`${formatAddress(invite.address)} invited on ${formatDate(
              invite.when
            )}`}
            disabled
          />
        </div>
      ))}
    </div>
  );
};

export default Invited;
