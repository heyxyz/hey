import { Bars3BottomLeftIcon } from "@heroicons/react/24/solid";
import { Tooltip } from "@hey/ui";
import type { FC } from "react";
import { usePublicationPollStore } from "src/store/non-persisted/publication/usePublicationPollStore";

const PollSettings: FC = () => {
  const { resetPollConfig, setShowPollEditor, showPollEditor } =
    usePublicationPollStore();

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
