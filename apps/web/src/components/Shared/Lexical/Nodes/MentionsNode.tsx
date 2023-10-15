import type { EditorConfig, NodeKey } from 'lexical';
import { TextNode } from 'lexical';

export class MentionNode extends TextNode {
  __mention: string;

  static getType(): string {
    return 'mention';
  }

  constructor(mentionName: string, text?: string, key?: NodeKey) {
    super(text ?? `@${mentionName}`, key);
    this.__mention = `@${mentionName}`;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = '';
    dom.className = 'text-brand';

    return dom;
  }
}

export const $createMentionNode = (mentionName: string): MentionNode => {
  const mentionNode = new MentionNode(mentionName);
  mentionNode.setMode('segmented').toggleDirectionless();

  return mentionNode;
};
