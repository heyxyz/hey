import type { FC } from "react";
import ProtectAccount from "./ProtectAccount";
import Suspended from "./Suspended";

const GlobalBanners: FC = () => {
  return (
    <>
      <Suspended />
      <ProtectAccount />
    </>
  );
};

export default GlobalBanners;
