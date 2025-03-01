import { STATIC_IMAGES_URL } from "@hey/data/constants";
import isPrideMonth from "@hey/helpers/isPrideMonth";
import type { FC } from "react";
import PageMetatags from "./PageMetatags";

const FullPageLoader: FC = () => {
  const logoSrc = isPrideMonth()
    ? `${STATIC_IMAGES_URL}/app-icon/1.png`
    : `${STATIC_IMAGES_URL}/app-icon/0.png`;

  return (
    <div className="grid h-screen place-items-center">
      <PageMetatags />
      <img
        alt="Logo"
        className="size-28"
        height={112}
        src={logoSrc}
        width={112}
      />
    </div>
  );
};

export default FullPageLoader;
