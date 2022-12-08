import { addClassNamesToElement } from '@lexical/utils';
import type { EditorConfig, LexicalNode, NodeKey, SerializedTextNode } from 'lexical';
import { TextNode } from 'lexical';

/** @noInheritDoc */
export class PreviewMentionNode extends TextNode {
  static getType(): string {
    return 'preview-mention';
  }

  static clone(node: PreviewMentionNode): PreviewMentionNode {
    return new PreviewMentionNode(node.__text, node.__key);
  }

  constructor(text: string, key?: NodeKey) {
    super(text, key);
  }

  createDOM(config: EditorConfig): HTMLElement {
    const element = super.createDOM(config);
    addClassNamesToElement(
      element,
      'text-transparent bg-clip-text bg-gradient-to-r from-brand-600 dark:from-brand-400 to-pink-600 dark:to-pink-400'
    );
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
      type: 'preview-mention'
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
