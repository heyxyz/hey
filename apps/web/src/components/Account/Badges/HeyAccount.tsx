import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";
import { Tooltip } from "@hey/ui";
import type { FC } from "react";

const HeyAccount: FC = () => {
  return (
    <Tooltip content={`Account Created on ${APP_NAME}`} placement="top">
      <img
        alt={`Account Created on ${APP_NAME} Badge`}
        className="drop-shadow-xl"
        height={75}
        src={`${STATIC_IMAGES_URL}/badges/hey-profile.png`}
        width={75}
      />
    </Tooltip>
  );
};

export default HeyAccount;
