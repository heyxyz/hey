import type { FC } from 'react';

import List from './List';

const Unmanaged: FC = () => {
  return (
    <div className="pt-2">
      <div>Profiles under your oversight but not under your management.</div>
      <div className="divider my-5" />
      <List />
    </div>
  );
};

export default Unmanaged;
