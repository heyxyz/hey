import type { FC } from 'react';

import { useEditor } from 'prosekit/react';
import { InlinePopover } from 'prosekit/react/inline-popover';

import type { EditorExtension } from './extension';

import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon
} from './icons';
import Toggle from './Toggle';

const InlineMenu: FC = () => {
  const editor = useEditor<EditorExtension>({ update: true });

  return (
    <InlinePopover className="z-10 box-border flex min-w-[120px] space-x-1 rounded-md border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-neutral-900">
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
      <Toggle
        disabled={!editor.commands.toggleUnderline.canApply()}
        onClick={() => editor.commands.toggleUnderline()}
        pressed={editor.marks.underline.isActive()}
        tooltip="Underline"
      >
        <UnderlineIcon className="size-4" />
      </Toggle>
      <Toggle
        disabled={!editor.commands.toggleCode.canApply()}
        onClick={() => editor.commands.toggleCode()}
        pressed={editor.marks.code.isActive()}
        tooltip="Code"
      >
        <CodeIcon className="size-4" />
      </Toggle>
      <Toggle
        disabled={!editor.commands.toggleStrike.canApply()}
        onClick={() => editor.commands.toggleStrike()}
        pressed={editor.marks.strike.isActive()}
        tooltip="Strikethrough"
      >
        <StrikethroughIcon className="size-4" />
      </Toggle>
    </InlinePopover>
  );
};

export default InlineMenu;
