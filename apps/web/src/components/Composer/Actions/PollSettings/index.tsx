import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@hey/ui";
import type { FC } from "react";
import { usePostPollStore } from "src/store/non-persisted/post/usePostPollStore";

const PollSettings: FC = () => {
  const { resetPollConfig, setShowPollEditor, showPollEditor } =
    usePostPollStore();

  return (
    <Tooltip content="Poll" placement="top">
      <button
        aria-label="Poll"
        className="rounded-full outline-offset-8"
        onClick={() => {
          resetPollConfig();
          setShowPollEditor(!showPollEditor);
        }}
        type="button"
      >
        <Bars3BottomLeftIcon className="size-5" />
      </button>
    </Tooltip>
  );
};

export default PollSettings;
