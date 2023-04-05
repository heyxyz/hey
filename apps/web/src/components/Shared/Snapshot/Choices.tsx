import { MenuAlt2Icon } from '@heroicons/react/outline';
import { CheckCircleIcon } from '@heroicons/react/solid';
import { t } from '@lingui/macro';
import clsx from 'clsx';
import { Errors, FeatureFlag } from 'data';
import isFeatureEnabled from 'lib/isFeatureEnabled';
import type { FC } from 'react';
import { toast } from 'react-hot-toast';
import type { Proposal, Vote } from 'snapshot';
import { useAppStore } from 'src/store/app';
import { Card } from 'ui';
import { useSignTypedData } from 'wagmi';

import New from '../Badges/New';

interface HeaderProps {
  proposal: Proposal;
  votes: Vote[];
}

const Choices: FC<HeaderProps> = ({ proposal, votes }) => {
  const currentProfile = useAppStore((state) => state.currentProfile);
  const { signTypedDataAsync, isLoading: typedDataLoading } = useSignTypedData({});

  const { choices, scores, scores_total } = proposal;
  const vote = votes[0];
  const choicesWithVote = choices.map((choice, index) => ({
    position: index + 1,
    choice,
    voted: Array.isArray(vote?.choice) ? vote?.choice.includes(index + 1) : vote?.choice === index + 1,
    percentage: ((scores?.[index] ?? 0) / (scores_total ?? 1)) * 100
  }));
  const sortedChoices = choicesWithVote.sort((a, b) => b.percentage - a.percentage);

  const sign = async (position: number) => {
    if (!isFeatureEnabled(FeatureFlag.SnapshotVoting, currentProfile?.id)) {
      return;
    }

    if (!currentProfile) {
      return toast.error(Errors.SignWallet);
    }

    const typedData = {
      domain: { name: 'snapshot', version: '0.1.4' },
      types: {
        Vote: [
          { name: 'from', type: 'address' },
          { name: 'space', type: 'string' },
          { name: 'timestamp', type: 'uint64' },
          { name: 'proposal', type: 'bytes32' },
          { name: 'choice', type: 'uint32' },
          { name: 'reason', type: 'string' },
          { name: 'app', type: 'string' },
          { name: 'metadata', type: 'string' }
        ]
      },
      value: {
        space: proposal.space?.id as string,
        proposal: proposal.id as `0x${string}`,
        choice: position,
        app: 'snapshot',
        reason: '',
        metadata: '{}',
        from: currentProfile?.ownedBy,
        timestamp: Number((Date.now() / 1e3).toFixed()) as any
      }
    };
    const signature = await signTypedDataAsync(typedData);
    console.log(signature);
  };

  return (
    <Card className="mt-5">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <div className="flex items-center space-x-2 font-bold">
          <MenuAlt2Icon className="h-5 w-5" />
          <b>{proposal.state === 'active' ? t`Current results` : t`Results`}</b>
        </div>
        <New />
      </div>
      <div className="space-y-4 p-5">
        {sortedChoices.map(({ position, choice, voted, percentage }) => (
          <div key={choice} className="flex items-center space-x-2.5 text-sm">
            <CheckCircleIcon
              onClick={() => sign(position)}
              className={clsx(voted ? 'text-green-500' : 'text-gray-500', 'h-6 w-6 ')}
            />
            <div className="w-full space-y-1">
              <div className="flex items-center justify-between">
                <b>{choice}</b>
                <span className="lt-text-gray-500">
                  {Number.isNaN(percentage) ? 0 : percentage.toFixed(2)}%
                </span>
              </div>
              <div className="flex h-2.5 overflow-hidden rounded-full bg-gray-300">
                <div
                  style={{ width: `${percentage.toFixed(2)}%` }}
                  className={clsx(voted ? 'bg-green-500' : 'bg-brand-500')}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Choices;
