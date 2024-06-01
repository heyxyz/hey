import type { FC } from 'react';

import { Button } from '@hey/ui';

const Connect: FC = () => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button>GitHub</Button>
      <Button disabled>Instagram</Button>
    </div>
  );
};

export default Connect;
