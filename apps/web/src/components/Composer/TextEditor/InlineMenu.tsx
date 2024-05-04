import { useEditor } from 'prosekit/react';
import { InlinePopover } from 'prosekit/react/inline-popover';

import type { TextEditorExtension } from './extension';

import {
  BoldIcon,
  CodeIcon,
  ItalicIcon,
  StrikethroughIcon,
  UnderlineIcon
} from './icons';
import Toggle from './Toggle';

const InlineMenu = () => {
  const editor = useEditor<TextEditorExtension>({ update: true });

  return (
    <InlinePopover className="relative z-10 box-border flex min-w-[120px] space-x-1 overflow-auto whitespace-nowrap rounded-md border border-gray-200 bg-white p-1 shadow-lg dark:border-gray-800 dark:bg-neutral-900">
      <Toggle
        disabled={!editor.commands.toggleBold.canApply()}
        onClick={() => editor.commands.toggleBold()}
        pressed={editor.marks.bold.isActive()}
        tooltip="Bold"
      >
        <BoldIcon className="h-5 w-5" />
      </Toggle>

      <Toggle
        disabled={!editor.commands.toggleItalic.canApply()}
        onClick={() => editor.commands.toggleItalic()}
        pressed={editor.marks.italic.isActive()}
        tooltip="Italic"
      >
        <ItalicIcon className="h-5 w-5" />
      </Toggle>

      <Toggle
        disabled={!editor.commands.toggleUnderline.canApply()}
        onClick={() => editor.commands.toggleUnderline()}
        pressed={editor.marks.underline.isActive()}
        tooltip="Underline"
      >
        <UnderlineIcon className="h-5 w-5" />
      </Toggle>

      <Toggle
        disabled={!editor.commands.toggleCode.canApply()}
        onClick={() => editor.commands.toggleCode()}
        pressed={editor.marks.code.isActive()}
        tooltip="Code"
      >
        <CodeIcon className="h-5 w-5" />
      </Toggle>

      <Toggle
        disabled={!editor.commands.toggleStrike.canApply()}
        onClick={() => editor.commands.toggleStrike()}
        pressed={editor.marks.strike.isActive()}
        tooltip="Strikethrough"
      >
        <StrikethroughIcon className="h-5 w-5" />
      </Toggle>
    </InlinePopover>
  );
};

export default InlineMenu;
