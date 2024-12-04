import type { FC } from "react";
import EmojiPicker from "./EmojiPicker";
import GroupPicker from "./GroupPicker";
import InlineMenu from "./InlineMenu";
import MentionPicker from "./MentionPicker";

const EditorMenus: FC = () => {
  return (
    <>
      <InlineMenu />
      <MentionPicker />
      <GroupPicker />
      <EmojiPicker />
    </>
  );
};

export default EditorMenus;
