import type { FC } from "react";

import ProtectProfile from "./ProtectProfile";
import Suspended from "./Suspended";

const GlobalBanners: FC = () => {
  return (
    <>
      <Suspended />
      <ProtectProfile />
    </>
  );
};

export default GlobalBanners;
