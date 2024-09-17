import type { FC } from "react";

import List from "./List";

const Managers: FC = () => {
  return (
    <div className="pt-2">
      <div className="mx-5 mb-5">
        Accounts with control over your profile can act on your behalf.
      </div>
      <div className="divider" />
      <div className="mx-5 my-3">
        <List />
      </div>
    </div>
  );
};

export default Managers;
