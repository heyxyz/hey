import type { Dispatch, FC, MutableRefObject, SetStateAction } from "react";

import { FaceSmileIcon } from "@heroicons/react/24/outline";
import stopEventPropagation from "@hey/helpers/stopEventPropagation";
import { Tooltip } from "@hey/ui";
import { useClickAway } from "@uidotdev/usehooks";
import { motion } from "framer-motion";

import List from "./List";

interface EmojiPickerProps {
  emoji?: null | string;
  setEmoji: (emoji: string) => void;
  setShowEmojiPicker: Dispatch<SetStateAction<boolean>>;
  showEmojiPicker: boolean;
}

const EmojiPicker: FC<EmojiPickerProps> = ({
  emoji,
  setEmoji,
  setShowEmojiPicker,
  showEmojiPicker
}) => {
  const listRef = useClickAway(() => {
    setShowEmojiPicker(false);
  }) as MutableRefObject<HTMLDivElement>;

  return (
    <Tooltip content="Emoji" placement="top">
      <div className="relative" ref={listRef}>
        <motion.button
          aria-label="Emoji"
          className="rounded-full outline-offset-8"
          onClick={(e) => {
            e.preventDefault();
            stopEventPropagation(e);
            setShowEmojiPicker(!showEmojiPicker);
          }}
          whileTap={{ scale: 0.9 }}
        >
          {emoji ? <span>{emoji}</span> : <FaceSmileIcon className="size-5" />}
        </motion.button>

        {showEmojiPicker ? (
          <div className="absolute z-[5] mt-1 w-[300px] rounded-xl border bg-white shadow-sm focus:outline-none dark:border-gray-700 dark:bg-gray-900">
            <List setEmoji={setEmoji} />
          </div>
        ) : null}
      </div>
    </Tooltip>
  );
};

export default EmojiPicker;
