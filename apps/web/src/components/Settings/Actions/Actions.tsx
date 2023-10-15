import { POLYGONSCAN_URL } from '@hey/data/constants';
import type { ProfileActionHistory } from '@hey/lens';
import formatAddress from '@hey/lib/formatAddress';
import { Card } from '@hey/ui';
import { formatDate } from '@lib/formatTime';
import Link from 'next/link';
import type { FC } from 'react';

interface ActionsProps {
  actions?: ProfileActionHistory[];
}

const Actions: FC<ActionsProps> = ({ actions }) => {
  if (!actions) {
    return null;
  }

  return (
    <div className="space-y-4 px-5 pb-5">
      {actions?.map((action) => {
        return (
          <Card key={action.id} className="space-y-1 p-5" forceRounded>
            <b>{action.actionType.toLowerCase()}</b>
            <div className="lt-text-gray-500 text-sm">
              {action.txHash ? (
                <span>
                  <span>Hash: </span>
                  <Link
                    className="hover:underline"
                    href={`${POLYGONSCAN_URL}/tx/${action.txHash}`}
                  >
                    {action.txHash.slice(0, 8 + 2)}…
                    {action.txHash.slice(action.txHash.length - 8)}
                  </Link>
                  <span className="mx-2 border-l dark:border-gray-700" />
                </span>
              ) : null}
              {action.who ? (
                <span>
                  <span>Acted by: </span>
                  <Link
                    className="hover:underline"
                    href={`${POLYGONSCAN_URL}/address/${action.who}`}
                  >
                    {formatAddress(action.who)}
                  </Link>
                  <span className="mx-2 border-l dark:border-gray-700" />
                </span>
              ) : null}
              {formatDate(action.actionedOn, 'MMM D, YYYY - hh:mm A')}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default Actions;
