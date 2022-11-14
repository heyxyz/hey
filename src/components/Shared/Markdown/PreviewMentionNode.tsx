import type { LexicalNode, NodeKey, SerializedTextNode } from 'lexical';
import { TextNode } from 'lexical';

export class PreviewMentionNode extends TextNode {
  static getType(): string {
    return 'previewmention';
  }

  static clone(node: PreviewMentionNode): PreviewMentionNode {
    return new PreviewMentionNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
    this.__text = text;
  }

  createDOM(): HTMLElement {
    const element = document.createElement('a');
    element.href = `/u/${this.__text.split('@')[1]}`;
    element.innerText = this.__text;
    element.target = 'blank';
    element.rel = 'noreferrer';
    element.className = 'mention';
    return element;
  }

  static importJSON(serializedNode: SerializedTextNode): PreviewMentionNode {
    // eslint-disable-next-line no-use-before-define
    const node = $createPreviewMentionNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedTextNode {
    return {
      ...super.exportJSON(),
      type: 'hashtag'
    };
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createPreviewMentionNode(text = ''): PreviewMentionNode {
  return new PreviewMentionNode(text);
}

export function $isPreviewMentionNode(node: LexicalNode | null | undefined): node is PreviewMentionNode {
  return node instanceof PreviewMentionNode;
}
