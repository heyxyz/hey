import { defineEditorExtension } from "@helpers/prosekit/extension";
import { htmlFromMarkdown } from "@helpers/prosekit/markdown";
import getAvatar from "@hey/helpers/getAvatar";
import { Image } from "@hey/ui";
import dynamic from "next/dynamic";
import "prosekit/basic/style.css";
import { createEditor } from "prosekit/core";
import { ProseKit } from "prosekit/react";
import type { FC } from "react";
import { useMemo, useRef } from "react";
import useContentChange from "src/hooks/prosekit/useContentChange";
import useFocus from "src/hooks/prosekit/useFocus";
import { usePaste } from "src/hooks/prosekit/usePaste";
import { usePostStore } from "src/store/non-persisted/post/usePostStore";
import { useAccountStore } from "src/store/persisted/useAccountStore";
import { useEditorHandle } from "./EditorHandle";

// Lazy load EditorMenus to reduce bundle size
const EditorMenus = dynamic(() => import("./EditorMenus"), { ssr: false });

const Editor: FC = () => {
  const { currentAccount } = useAccountStore();
  const { postContent } = usePostStore();
  const defaultMarkdownRef = useRef(postContent);

  const defaultContent = useMemo(() => {
    const markdown = defaultMarkdownRef.current;
    return markdown ? htmlFromMarkdown(markdown) : undefined;
  }, []);

  const editor = useMemo(() => {
    const extension = defineEditorExtension();
    return createEditor({ defaultContent, extension });
  }, [defaultContent]);

  useFocus(editor);
  useContentChange(editor);
  usePaste(editor);
  useEditorHandle(editor);

  return (
    <ProseKit editor={editor}>
      <div className="box-border flex h-full w-full justify-stretch overflow-y-auto overflow-x-hidden px-5 py-4">
        <Image
          alt={currentAccount?.id}
          className="mr-3 size-11 rounded-full border bg-gray-200 dark:border-gray-700"
          src={getAvatar(currentAccount)}
        />
        <div className="flex flex-1 flex-col overflow-x-hidden">
          <EditorMenus />
          <div
            className="relative mt-[8.5px] box-border h-full min-h-[80px] flex-1 overflow-auto leading-6 outline-0 sm:leading-[26px]"
            ref={editor.mount}
          />
        </div>
      </div>
    </ProseKit>
  );
};

export default Editor;
