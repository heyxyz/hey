import { APP_NAME } from "@hey/data/constants";
import { FeatureFlag } from "@hey/data/feature-flags";
import type { App } from "@hey/indexer";
import { useFlag } from "@unleash/proxy-client-react";
import type { FC } from "react";

interface SourceProps {
  app: App;
}

const Source: FC<SourceProps> = ({ app }) => {
  const enabled = useFlag(FeatureFlag.Staff);
  const show = app.metadata?.name.toLowerCase() === APP_NAME.toLowerCase();

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
        src={app.metadata?.logo}
      />
    </span>
  );
};

export default Source;
