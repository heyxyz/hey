import type { Rule } from '@lenster/types/communities';
import type { FC } from 'react';

interface RulesProps {
  rules?: Rule[];
}

const Rules: FC<RulesProps> = ({ rules }) => {
  if (!rules) {
    return null;
  }

  return (
    <>
      <div className="divider w-full" />
      <div className="space-y-5">
        <div>
          <div className="text-lg font-bold">Rules</div>
          <div>These are set and enforced by Community admins</div>
        </div>
        {rules.map((rule, index) => (
          <div key={rule.id} className="flex items-start space-x-2">
            <div className="bg-brand-500 flex h-8 w-8 items-center justify-center rounded-full p-3 text-sm font-bold text-white">
              {index + 1}
            </div>
            <div className="space-y-1">
              <div className="font-bold">{rule.title}</div>
              <div className="lt-text-gray-500 text-sm">{rule.description}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Rules;
