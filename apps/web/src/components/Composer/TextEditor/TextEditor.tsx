import getAvatar from '@hey/helpers/getAvatar';
import { Image } from '@hey/ui';
import 'prosekit/basic/style.css';
import { createEditor } from 'prosekit/core';
import { ProseKit } from 'prosekit/react';
import { useMemo } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import EmojiPicker from './EmojiPicker';
import { defineTextEditorExtension } from './extension';
import InlineMenu from './InlineMenu';
import MentionPicker from './MentionPicker';
import { useContentChange } from './useContentChange';
import { usePaste } from './usePaste';

export default function Editor() {
  const { currentProfile } = useProfileStore();
  const editor = useMemo(() => {
    const extension = defineTextEditorExtension();
    return createEditor({ extension });
  }, []);

  useContentChange(editor);
  usePaste(editor);

  return (
    <ProseKit editor={editor}>
      <div className="box-border flex h-full w-full justify-stretch overflow-y-auto overflow-x-hidden px-5 py-4">
        <Image
          alt={currentProfile?.id}
          className="mr-3 size-11 rounded-full border bg-gray-200 dark:border-gray-700"
          src={getAvatar(currentProfile)}
        />
        <div className="flex flex-1 flex-col">
          <InlineMenu />
          <MentionPicker />
          <EmojiPicker />
          <div
            className="relative mt-[8.5px] box-border h-full min-h-[80px] flex-1 overflow-auto leading-6 outline-0 sm:leading-[26px]"
            ref={editor.mount}
          />
        </div>
      </div>
    </ProseKit>
  );
}
