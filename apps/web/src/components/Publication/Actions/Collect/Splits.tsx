import { Trans } from '@lingui/macro';
import { POLYGONSCAN_URL } from 'data/constants';
import type { RecipientDataOutput } from 'lens';
import formatAddress from 'lib/formatAddress';
import getStampFyiURL from 'lib/getStampFyiURL';
import type { FC } from 'react';

interface SplitsProps {
  recipients: RecipientDataOutput[];
}

const Splits: FC<SplitsProps> = ({ recipients }) => {
  if (recipients.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 pt-3">
      <div className="mb-2 font-bold">
        <Trans>Fee recipients</Trans>
      </div>
      {recipients.map((recipient, index) => {
        const { recipient: address, split } = recipient;
        return (
          <div key={`${address}_${index}`} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <img
                className="h-5 w-5 rounded-full border bg-gray-200 dark:border-gray-700"
                src={getStampFyiURL(address)}
                alt="Avatar"
              />
              <a href={`${POLYGONSCAN_URL}/address/${address}`} target="_blank" rel="noreferrer">
                {formatAddress(address, 6)}
              </a>
            </div>
            <div className="font-bold">{split}%</div>
          </div>
        );
      })}
    </div>
  );
};

export default Splits;
