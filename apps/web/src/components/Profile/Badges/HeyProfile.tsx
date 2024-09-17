import type { FC } from "react";

import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Tooltip } from "@hey/ui";

const HeyProfile: FC = () => {
  return (
    <Tooltip content={`Profile Created on ${APP_NAME}`} placement="top">
      <img
        alt={`Profile Created on ${APP_NAME} Badge`}
        className="drop-shadow-xl"
        height={75}
        src={`${STATIC_IMAGES_URL}/badges/hey-profile.png`}
        width={75}
      />
    </Tooltip>
  );
};

export default HeyProfile;
