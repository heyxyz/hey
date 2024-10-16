import type { FC } from "react";
import ProtectProfile from "./ProtectProfile";
import SuspendWarning from "./SuspendWarning";
import Suspended from "./Suspended";

const GlobalBanners: FC = () => {
  return (
    <>
      <Suspended />
      <SuspendWarning />
      <ProtectProfile />
    </>
  );
};

export default GlobalBanners;
