import type { ProfileActionHistory } from '@hey/lens';
import { Card } from '@hey/ui';
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
          <Card
            key={action.id}
            className="flex flex-wrap items-start justify-between p-5"
            forceRounded
          >
            {JSON.stringify(action)}
          </Card>
        );
      })}
    </div>
  );
};

export default Actions;
