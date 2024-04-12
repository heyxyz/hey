import 'prosekit/basic/style.css';
import { createEditor } from 'prosekit/core';
import { ProseKit } from 'prosekit/react';
import { useMemo } from 'react';

import { defineExtension } from './extensions';
import InlineMenu from './inline-menu';
import UserMenu from './user-menu';

export default function NewEditor() {
  const editor = useMemo(() => {
    return createEditor({ extension: defineExtension() });
  }, []);

  return (
    <ProseKit editor={editor}>
      <div className="h-full min-h-32 w-full overflow-y-auto overflow-x-hidden p-5">
        <div className="relative flex min-h-full w-full flex-col">
          <div
            className='[&_span[data-mention="profile"]]:text-brand-500 [&_span[data-mention="tag"]]:text-brand-500 overflow-auto outline-none'
            ref={editor.mount}
          />
          <InlineMenu />
          <UserMenu />
        </div>
      </div>
    </ProseKit>
  );
}
