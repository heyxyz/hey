import { hashtagRegex, mentionRegex, urlRegex } from '@lib/markupUtils';
import trimify from '@lib/trimify';
import clsx from 'clsx';
import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
// @ts-ignore
import linkifyRegex from 'remark-linkify-regex';
import stripMarkdown from 'strip-markdown';

import Code from './Code';
import MarkupLink from './MarkupLink';

interface Props {
  children: string;
  className?: string;
  matchOnlyUrl?: boolean;
}

const Markup: FC<Props> = ({ children, className = '' }) => {
  const plugins = [
    [stripMarkdown, { keep: ['strong', 'emphasis', 'inlineCode'] }],
    remarkBreaks,
    linkifyRegex(mentionRegex),
    linkifyRegex(hashtagRegex),
    linkifyRegex(urlRegex)
  ];

  const components = {
    a: MarkupLink,
    code: Code
  };

  return (
    <ReactMarkdown className={clsx('list-inside', className)} components={components} remarkPlugins={plugins}>
      {trimify(children)}
    </ReactMarkdown>
  );
};

export default Markup;
