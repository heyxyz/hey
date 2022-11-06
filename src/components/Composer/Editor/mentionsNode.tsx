import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedTextNode,
  Spread
} from 'lexical';
import { TextNode } from 'lexical';

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
    type: 'mention';
    version: 1;
  },
  SerializedTextNode
>;

const mentionStyle = 'background-color: rgba(24, 119, 232, 0.2)';
export class MentionNode extends TextNode {
  __mention: string;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention, node.__text, node.__key);
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    // eslint-disable-next-line no-use-before-define
    const node = $createMentionNode(serializedNode.mentionName);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(mentionName: string, text?: string, key?: NodeKey) {
    super(text ?? `@${mentionName}`, key);
    this.__mention = `@${mentionName}`;
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      type: 'mention',
      version: 1
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mentionStyle;
    dom.className =
      'text-transparent bg-clip-text bg-gradient-to-r from-brand-600 dark:from-brand-400 to-pink-600 dark:to-pink-400';
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention')) {
          return null;
        }
        return {
          // eslint-disable-next-line no-use-before-define
          conversion: convertMentionElement,
          priority: 1
        };
      }
    };
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createMentionNode(mentionName: string): MentionNode {
  const mentionNode = new MentionNode(mentionName);
  mentionNode.setMode('segmented').toggleDirectionless();
  return mentionNode;
}

function convertMentionElement(domNode: HTMLElement): DOMConversionOutput | null {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = $createMentionNode(textContent);
    return {
      node
    };
  }

  return null;
}

export function $isMentionNode(node: LexicalNode | null | undefined): node is MentionNode {
  return node instanceof MentionNode;
}
