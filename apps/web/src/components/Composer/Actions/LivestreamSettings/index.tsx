import { VideoCameraIcon } from "@heroicons/react/24/outline";
import { Tooltip } from "@hey/ui";
import cn from "@hey/ui/cn";
import type { FC } from "react";
import { usePostAttachmentStore } from "src/store/non-persisted/post/usePostAttachmentStore";
import { usePostLiveStore } from "src/store/non-persisted/post/usePostLiveStore";

const LivestreamSettings: FC = () => {
  const { resetLiveVideoConfig, setShowLiveVideoEditor, showLiveVideoEditor } =
    usePostLiveStore();
  const { attachments } = usePostAttachmentStore((state) => state);
  const disable = attachments.length > 0;

  return (
    <Tooltip content="Go Live" placement="top">
      <button
        aria-label="Go Live"
        className={cn("rounded-full outline-offset-8", {
          "opacity-50": disable
        })}
        disabled={disable}
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
