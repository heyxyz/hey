import type { FC } from 'react';

import List from './List';

const Managers: FC = () => {
  return (
    <div className="pt-2">
      <div>Accounts with control over your profile can act on your behalf.</div>
      <div className="divider my-5" />
      <List />
    </div>
  );
};

export default Managers;
