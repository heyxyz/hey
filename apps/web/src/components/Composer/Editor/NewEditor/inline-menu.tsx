import type { LinkAttrs } from 'prosekit/extensions/link';
import type { EditorState } from 'prosekit/pm/state';

import { useEditor } from 'prosekit/react';
import { InlinePopover } from 'prosekit/react/inline-popover';
import { useState } from 'react';

import type { EditorExtension } from './extensions';

import Toggle from './toggle';

export default function InlineMenu() {
  const editor = useEditor<EditorExtension>({ update: true });

  const [linkMenuAvailable, setLinkMenuAvailable] = useState(false);
  const toggleLinkMenuAvailable = () => setLinkMenuAvailable((open) => !open);

  const getCurrentLink = (state: EditorState): string | undefined => {
    const { $from } = state.selection;
    const marks = $from.marksAcross($from);
    if (!marks) {
      return;
    }
    for (const mark of marks) {
      if (mark.type.name === 'link') {
        return (mark.attrs as LinkAttrs).href;
      }
    }
  };

  const handleLinkUpdate = (href?: string) => {
    if (href) {
      editor.commands.addLink({ href });
    } else {
      editor.commands.removeLink();
    }

    setLinkMenuAvailable(false);
    editor.focus();
  };

  return (
    <>
      <InlinePopover
        className="relative z-10 box-border block min-w-[120px] space-x-1 overflow-auto whitespace-nowrap rounded-lg rounded-md border border-zinc-200 bg-white p-1 shadow-lg dark:border-zinc-800 dark:bg-neutral-900"
        editor={editor}
        onOpenChange={(open) => {
          if (!open) {
            setLinkMenuAvailable(false);
          }
        }}
      >
        <Toggle
          disabled={!editor.commands.toggleBold.canApply()}
          onClick={() => editor.commands.toggleBold()}
          pressed={editor.marks.bold.isActive()}
        >
          <div className="i-lucide-bold h-5 w-5" />
        </Toggle>

        <Toggle
          disabled={!editor.commands.toggleItalic.canApply()}
          onClick={() => editor.commands.toggleItalic()}
          pressed={editor.marks.italic.isActive()}
        >
          <div className="i-lucide-italic h-5 w-5" />
        </Toggle>

        <Toggle
          disabled={!editor.commands.toggleUnderline.canApply()}
          onClick={() => editor.commands.toggleUnderline()}
          pressed={editor.marks.underline.isActive()}
        >
          <div className="i-lucide-underline h-5 w-5" />
        </Toggle>

        <Toggle
          disabled={!editor.commands.toggleStrike.canApply()}
          onClick={() => editor.commands.toggleStrike()}
          pressed={editor.marks.strike.isActive()}
        >
          <div className="i-lucide-strikethrough h-5 w-5" />
        </Toggle>

        <Toggle
          disabled={!editor.commands.toggleCode.canApply()}
          onClick={() => editor.commands.toggleCode()}
          pressed={editor.marks.code.isActive()}
        >
          <div className="i-lucide-code h-5 w-5" />
        </Toggle>

        {editor.commands.addLink.canApply({ href: '' }) && (
          <Toggle
            onClick={() => {
              editor.commands.expandLink();
              toggleLinkMenuAvailable();
            }}
            pressed={editor.marks.link.isActive()}
          >
            <div className="i-lucide-link h-5 w-5" />
          </Toggle>
        )}
      </InlinePopover>

      <InlinePopover
        available={linkMenuAvailable}
        className="w-xs relative z-10 box-border flex flex-col items-stretch gap-y-2 rounded-lg rounded-lg border border-zinc-200 bg-white p-4 shadow-lg dark:border-zinc-800 dark:bg-neutral-900"
        editor={editor}
        onOpenChange={setLinkMenuAvailable}
        positioning={{
          fitViewport: true,
          flip: false,
          hide: true,
          inline: true,
          offset: 12,
          overlap: true,
          placement: 'bottom',
          shift: true,
          strategy: 'fixed'
        }}
      >
        {linkMenuAvailable && (
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const target = event.target as HTMLFormElement | null;
              const href = target?.querySelector('input')?.value?.trim();
              handleLinkUpdate(href);
            }}
          >
            <input
              className="box-border flex h-10 w-full rounded-md border border-solid border-zinc-200 bg-white px-3 py-2 text-sm outline-none ring-0 ring-transparent transition file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:bg-neutral-900 dark:placeholder:text-zinc-500 dark:focus-visible:ring-zinc-300"
              defaultValue={getCurrentLink(editor.state)}
              placeholder="Paste the link..."
            />
          </form>
        )}
        {editor.marks.link.isActive() && (
          <button
            className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-md bg-zinc-900 px-3 text-sm font-medium text-zinc-50 ring-offset-white transition-colors hover:bg-zinc-900/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-900 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-zinc-50 dark:text-zinc-900 dark:ring-offset-neutral-900 dark:hover:bg-zinc-50/90 dark:focus-visible:ring-zinc-300"
            onClick={() => handleLinkUpdate()}
            onMouseDown={(event) => event.preventDefault()}
          >
            Remove link
          </button>
        )}
      </InlinePopover>
    </>
  );
}
