import type Suggestion from '@tiptap/suggestion';
import type { SuggestionProps } from '@tiptap/suggestion';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';

import type { NodeSuggestionOptions } from './Suggestion';

type Suggestion = NodeSuggestionOptions['suggestion'];

function makeSuggestionRender<T>(
  mentionList: ForwardRefExoticComponent<
    SuggestionProps<T> & RefAttributes<unknown>
  >
): Suggestion['render'] {
  return () => {
    let component: ReactRenderer;
    let popup: ReturnType<typeof tippy>;
    return {
      onExit() {
        popup?.[0].destroy();
        component?.destroy();
      },
      onKeyDown(props) {
        if (
          props.event.key &&
          (props.event.key === 'Escape' ||
            (props.event.key === 'Enter' && !popup?.[0].state.isShown))
        ) {
          popup?.[0].destroy();
          component?.destroy();
          return false;
        }
        return (component?.ref as any)?.onKeyDown(props);
      },
      onStart: (props) => {
        component = new ReactRenderer(mentionList, {
          editor: props.editor,
          props
        });
        if (!props.clientRect) {
          return;
        }

        popup = tippy('body', {
          appendTo: () => document.body,
          content: component?.element,
          getReferenceClientRect: () => props?.clientRect?.()!,
          interactive: true,
          placement: 'bottom-start',
          showOnCreate: true,
          trigger: 'manual'
        });
      },
      onUpdate(props) {
        component?.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup?.[0].setProps({
          getReferenceClientRect: () => props?.clientRect?.()!
        });
      }
    };
  };
}

export default makeSuggestionRender;
