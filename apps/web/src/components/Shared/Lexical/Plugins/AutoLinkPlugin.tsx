import { AutoLinkPlugin } from '@lexical/react/LexicalAutoLinkPlugin';
import { URL_REGEX } from 'data';
import type { FC } from 'react';

const MATCHERS = [
  (text: string) => {
    const match = URL_REGEX.exec(text);
    if (match === null) {
      return null;
    }
    const fullMatch = match[0];
    return {
      index: match.index,
      length: fullMatch.length,
      text: fullMatch,
      url: fullMatch.startsWith('http') ? fullMatch : `https://${fullMatch}`
    };
  }
];

const LexicalAutoLinkPlugin: FC = () => {
  return <AutoLinkPlugin matchers={MATCHERS} />;
};

export default LexicalAutoLinkPlugin;
