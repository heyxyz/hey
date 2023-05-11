import { HANDLE_REGEX, HASHTAG_REGEX, URL_REGEX } from 'data';
import trimify from 'lib/trimify';
import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
// @ts-ignore
import linkifyRegex from 'remark-linkify-regex';
import stripMarkdown from 'strip-markdown';

import Code from './Code';
import MarkupLink from './MarkupLink';

const plugins = [
  [stripMarkdown, { keep: ['strong', 'emphasis', 'inlineCode'] }],
  remarkBreaks,
  linkifyRegex(HANDLE_REGEX),
  linkifyRegex(HASHTAG_REGEX),
  linkifyRegex(URL_REGEX)
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
    <ReactMarkdown
      className={className}
      components={components}
      remarkPlugins={plugins}
    >
      {trimify(children)}
    </ReactMarkdown>
  );
};

export default Markup;
