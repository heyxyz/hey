import { APP_NAME, STATIC_IMAGES_URL } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";

interface SourceProps {
  publishedOn: string | undefined;
}

const Source: FC<SourceProps> = ({ publishedOn }) => {
  const enabled = useFlag(FeatureFlag.Staff);
  const show = publishedOn === APP_NAME.toLowerCase();

  if (!enabled || !show) {
    return null;
  }

  return (
    <span className="ld-text-gray-500 flex items-center">
      <span className="mr-1">·</span>
      <img
        alt="Logo"
        className="mt-0.5 h-3.5 rounded-sm"
        height={14}
        src={`${STATIC_IMAGES_URL}/app-icon/0.png`}
      />
    </span>
  );
};

export default Source;
