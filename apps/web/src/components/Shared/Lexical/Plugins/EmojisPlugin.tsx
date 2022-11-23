import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import type { LexicalEditor } from 'lexical';
import { TextNode } from 'lexical';
import { useEffect } from 'react';

import { $createEmojiNode, EmojiNode } from '../Nodes/EmojiNode';

const emojis: Map<string, [string, string]> = new Map([
  [':)', ['emoji happysmile', '🙂']],
  [':(', ['emoji sadsmile', '🙁']],
  [';)', ['emoji winksmile', '😉']],
  [':D', ['emoji bigsmile', '😃']],
  [':P', ['emoji tongue', '😛']],
  [':O', ['emoji shock', '😮']],
  [':|', ['emoji neutral', '😐']],
  [':/', ['emoji confused', '😕']],
  [':*', ['emoji kiss', '😘']],
  [':$', ['emoji blush', '😳']],
  [':@', ['emoji angry', '😠']],
  [':s', ['emoji smirk', '😏']],
  [':l', ['emoji sealed', '🌸']],
  ['<3', ['emoji heart', '💜']]
]);

const findAndTransformEmoji = (node: TextNode): null | TextNode => {
  const text = node.getTextContent();

  for (let i = 0; i < text.length; i++) {
    const emojiData = emojis.get(text[i]) || emojis.get(text.slice(i, i + 2));

    if (emojiData !== undefined) {
      const [emojiStyle, emojiText] = emojiData;
      let targetNode;

      if (i === 0) {
        [targetNode] = node.splitText(i + 2);
      } else {
        [, targetNode] = node.splitText(i, i + 2);
      }

      const emojiNode = $createEmojiNode(emojiStyle, emojiText);
      targetNode.replace(emojiNode);

      return emojiNode;
    }
  }

  return null;
};

const textNodeTransform = (node: TextNode): void => {
  let targetNode: TextNode | null = node;

  while (targetNode !== null) {
    if (!targetNode.isSimpleText()) {
      return;
    }

    targetNode = findAndTransformEmoji(targetNode);
  }
};

const useEmojis = (editor: LexicalEditor): void => {
  useEffect(() => {
    if (!editor.hasNodes([EmojiNode])) {
      throw new Error('EmojisPlugin: EmojiNode not registered on editor');
    }

    return editor.registerNodeTransform(TextNode, textNodeTransform);
  }, [editor]);
};

export const EmojisPlugin = (): JSX.Element | null => {
  const [editor] = useLexicalComposerContext();
  useEmojis(editor);

  return null;
};

export default EmojisPlugin;
