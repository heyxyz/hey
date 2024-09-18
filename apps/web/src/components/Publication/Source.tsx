import { apps } from "@hey/data/apps";
import { STATIC_IMAGES_URL } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import getAppName from "@hey/helpers/getAppName";
import { Tooltip } from "@hey/ui";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";

interface SourceProps {
  publishedOn: string | undefined;
}

const Source: FC<SourceProps> = ({ publishedOn }) => {
  const enabled = useFlag(FeatureFlag.Staff);
  const show = publishedOn && apps.includes(publishedOn);

  if (!enabled || !show) {
    return null;
  }

  const appName = getAppName(publishedOn);

  return (
    <span className="ld-text-gray-500 flex items-center">
      <span className="mx-1">·</span>
      <Tooltip content={appName} placement="top">
        <img
          alt={appName}
          className="mt-0.5 h-3.5 rounded-sm"
          height={14}
          src={`${STATIC_IMAGES_URL}/source/${publishedOn}.png`}
        />
      </Tooltip>
    </span>
  );
};

export default Source;
