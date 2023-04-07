import { hashtagRegex, mentionRegex, urlRegex } from '@lib/markupUtils';
import trimify from 'lib/trimify';
import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
import safeRegex from 'safe-regex';
// @ts-ignore
import linkifyRegex from 'remark-linkify-regex';
import stripMarkdown from 'strip-markdown';

import Code from './Code';
import MarkupLink from './MarkupLink';

const safeUrlRegex = safeRegex(urlRegex) ? urlRegex : /https?:\/\/[^\s]+/g;
const plugins = [
  [stripMarkdown, { keep: ['strong', 'emphasis', 'inlineCode'] }],
  remarkBreaks,
  linkifyRegex(urlRegex, { safe: true }),
  linkifyRegex(mentionRegex),
  linkifyRegex(hashtagRegex),
  linkifyRegex(urlRegex)
];

const components = {
  a: MarkupLink,
  code: Code
};

interface MarkupProps {
  children: string;
  className?: string;
  matchOnlyUrl?: boolean;
}

const Markup: FC<MarkupProps> = ({ children, className = '' }) => {
  return (
    <ReactMarkdown className={className} components={components} remarkPlugins={plugins}>
      {trimify(children)}
    </ReactMarkdown>
  );
};

export default Markup;
