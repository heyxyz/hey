import type { FC } from 'react';

import EmojiPicker from './EmojiPicker';
import InlineMenu from './InlineMenu';
import MentionPicker from './MentionPicker';

const EditorMenus: FC = () => {
  return (
    <>
      <InlineMenu />
      <MentionPicker />
      <EmojiPicker />
    </>
  );
};

export default EditorMenus;
