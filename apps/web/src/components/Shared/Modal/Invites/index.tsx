import type { FC } from 'react';

import Invited from './Invited';

const Invites: FC = () => {
  return (
    <div className="max-h-[80vh] overflow-y-auto p-5">
      <Invited />
    </div>
  );
};

export default Invites;
