import { MenuAlt2Icon } from '@heroicons/react/outline';
import { t } from '@lingui/macro';
import type { FC } from 'react';
import type { Proposal } from 'snapshot';
import { Card } from 'ui';

interface HeaderProps {
  proposal: Proposal;
}

const Choices: FC<HeaderProps> = ({ proposal }) => {
  const { choices, scores, scores_total } = proposal;
  const sortedChoices = choices
    .map((choice, index) => ({
      choice,
      percentage: ((scores?.[index] ?? 0) / (scores_total ?? 1)) * 100
    }))
    .sort((a, b) => b.percentage - a.percentage);

  return (
    <Card className="mt-5">
      <div className="flex items-center space-x-2 border-b px-5 py-3 font-bold">
        <MenuAlt2Icon className="h-5 w-5" />
        <b>{proposal.state === 'active' ? t`Current results` : t`Results`}</b>
      </div>
      <div className="space-y-3 p-5">
        {sortedChoices.map(({ choice, percentage }) => (
          <div key={choice} className="space-y-1 text-sm">
            <div className="flex items-center justify-between">
              <b>{choice}</b>
              <span className="lt-text-gray-500">{percentage.toFixed(2)}%</span>
            </div>
            <div className="relative w-full">
              <div className="flex h-2.5 overflow-hidden rounded-full bg-gray-300">
                <div style={{ width: `${percentage.toFixed(2)}%` }} className="bg-brand-500" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default Choices;
