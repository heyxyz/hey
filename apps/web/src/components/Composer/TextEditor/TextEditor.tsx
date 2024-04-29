import getAvatar from '@hey/helpers/getAvatar';
import { Image } from '@hey/ui';
import dynamic from 'next/dynamic';
import 'prosekit/basic/style.css';
import { createEditor } from 'prosekit/core';
import { ProseKit } from 'prosekit/react';
import { useMemo } from 'react';
import { useProfileStore } from 'src/store/persisted/useProfileStore';

import type { TextEditorHandle } from './useEditorHandle';

import { defineTextEditorExtension } from './extension';
import { useContentChange } from './useContentChange';
import { useEditorHandle } from './useEditorHandle';
import { usePaste } from './usePaste';

// Some components use DOM API (e.g. class CustomElement extends HTMLElement).
// It would throw error when importing in server-side. We only import it in
// client-side.
const TextEditorMenus = dynamic(() => import('./TextEditorMenus'), {
  ssr: false
});

const TextEditor = (props: { editorRef: React.Ref<TextEditorHandle> }) => {
  const { currentProfile } = useProfileStore();
  const editor = useMemo(() => {
    const extension = defineTextEditorExtension();
    return createEditor({ extension });
  }, []);

  useContentChange(editor);
  usePaste(editor);
  useEditorHandle(editor, props.editorRef);

  return (
    <ProseKit editor={editor}>
      <div className="box-border flex h-full w-full justify-stretch overflow-y-auto overflow-x-hidden px-5 py-4">
        <Image
          alt={currentProfile?.id}
          className="mr-3 size-11 rounded-full border bg-gray-200 dark:border-gray-700"
          src={getAvatar(currentProfile)}
        />
        <div className="flex flex-1 flex-col">
          <TextEditorMenus />
          <div
            className="relative mt-[8.5px] box-border h-full min-h-[80px] flex-1 overflow-auto leading-6 outline-0 sm:leading-[26px]"
            ref={editor.mount}
          />
        </div>
      </div>
    </ProseKit>
  );
};

export default TextEditor;
