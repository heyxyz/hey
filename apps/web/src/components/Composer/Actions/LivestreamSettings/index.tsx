import { VideoCameraIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@hey/ui";
import type { FC } from "react";
import { usePublicationLiveStore } from "src/store/non-persisted/publication/usePublicationLiveStore";

const LivestreamSettings: FC = () => {
  const { resetLiveVideoConfig, setShowLiveVideoEditor, showLiveVideoEditor } =
    usePublicationLiveStore();

  return (
    <Tooltip content="Go Live" placement="top">
      <button
        aria-label="Go Live"
        className="rounded-full outline-offset-8"
        onClick={() => {
          resetLiveVideoConfig();
          setShowLiveVideoEditor(!showLiveVideoEditor);
        }}
        type="button"
      >
        <VideoCameraIcon className="size-5" />
      </button>
    </Tooltip>
  );
};

export default LivestreamSettings;
