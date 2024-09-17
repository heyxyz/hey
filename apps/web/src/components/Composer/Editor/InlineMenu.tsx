import type { EditorExtension } from "@helpers/prosekit/extension";
import type { FC } from "react";

import { BoldIcon, ItalicIcon } from "@heroicons/react/24/outline";
import { useEditor } from "prosekit/react";
import { InlinePopover } from "prosekit/react/inline-popover";

import Toggle from "./Toggle";

const InlineMenu: FC = () => {
  const editor = useEditor<EditorExtension>({ update: true });

  return (
    <InlinePopover className="z-10 flex space-x-1 rounded-xl border bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
      <Toggle
        disabled={!editor.commands.toggleBold.canApply()}
        onClick={() => editor.commands.toggleBold()}
        pressed={editor.marks.bold.isActive()}
        tooltip="Bold"
      >
        <BoldIcon className="size-4" />
      </Toggle>
      <Toggle
        disabled={!editor.commands.toggleItalic.canApply()}
        onClick={() => editor.commands.toggleItalic()}
        pressed={editor.marks.italic.isActive()}
        tooltip="Italic"
      >
        <ItalicIcon className="size-4" />
      </Toggle>
    </InlinePopover>
  );
};

export default InlineMenu;
