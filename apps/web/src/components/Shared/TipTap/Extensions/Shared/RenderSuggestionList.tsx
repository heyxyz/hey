import type Suggestion from '@tiptap/suggestion';
import type { SuggestionProps } from '@tiptap/suggestion';
import type { ForwardRefExoticComponent, RefAttributes } from 'react';

import { ReactRenderer } from '@tiptap/react';

import type { NodeSuggestionOptions } from './Suggestion';

type Suggestion = NodeSuggestionOptions['suggestion'];

function makeSuggestionRender<T>(
  mentionList: ForwardRefExoticComponent<
    SuggestionProps<T> & RefAttributes<unknown>
  >
): Suggestion['render'] {
  return () => {
    let component: ReactRenderer;
    let popupElement: HTMLElement | null = null;

    const removePopup = () => {
      popupElement?.remove();
      component?.destroy();
    };

    const updatePopupPosition = (clientRect: DOMRect) => {
      if (!popupElement) {
        return;
      }
      popupElement.style.top = `${clientRect.bottom + window.scrollY + 16}px`;
      popupElement.style.left = `${clientRect.left + window.scrollX}px`;
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (popupElement && !popupElement.contains(event.target as Node)) {
        removePopup();
        document.removeEventListener('mousedown', handleClickOutside);
      }
    };

    return {
      onExit() {
        removePopup();
        document.removeEventListener('mousedown', handleClickOutside);
      },
      onKeyDown(props) {
        if (
          props.event.key &&
          (props.event.key === 'Escape' ||
            (props.event.key === 'Enter' && !popupElement?.isConnected))
        ) {
          removePopup();
          document.removeEventListener('mousedown', handleClickOutside);
          return false;
        }
        return (component?.ref as any)?.onKeyDown(props);
      },
      onStart: (props) => {
        component = new ReactRenderer(mentionList, {
          editor: props.editor,
          props
        });
        if (!props.clientRect || !component.element) {
          return;
        }
        popupElement = document.createElement('div');
        popupElement.style.position = 'absolute';
        popupElement.appendChild(component.element);
        document.body.appendChild(popupElement);
        document.addEventListener('mousedown', handleClickOutside);
        const clientRect = props.clientRect();
        updatePopupPosition(clientRect!);
      },
      onUpdate(props) {
        component?.updateProps(props);
        if (!props.clientRect || !popupElement) {
          return;
        }
        const clientRect = props.clientRect();
        updatePopupPosition(clientRect!);
      }
    };
  };
}

export default makeSuggestionRender;
