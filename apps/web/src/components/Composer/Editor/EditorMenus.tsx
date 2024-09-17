import type { FC } from "react";

import ClubPicker from "./ClubPicker";
import EmojiPicker from "./EmojiPicker";
import InlineMenu from "./InlineMenu";
import MentionPicker from "./MentionPicker";

const EditorMenus: FC = () => {
  return (
    <>
      <InlineMenu />
      <MentionPicker />
      <ClubPicker />
      <EmojiPicker />
    </>
  );
};

export default EditorMenus;
