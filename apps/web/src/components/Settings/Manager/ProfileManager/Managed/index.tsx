import type { FC } from 'react';

import List from './List';

const Managed: FC = () => {
  return (
    <div className="pt-2">
      <div>Profiles under your oversight and management.</div>
      <div className="divider my-5" />
      <List />
    </div>
  );
};

export default Managed;
