import { hashtagRegex, mentionRegex, urlRegex } from '@lib/markupUtils';
import trimify from '@lib/trimify';
import clsx from 'clsx';
import type { FC } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
// @ts-ignore
import linkifyRegex from 'remark-linkify-regex';
import stripMarkdown from 'strip-markdown';

import ExternalLink from './ExternalLink';
import Hashtag from './Hashtag';
import Mention from './Mention';

export interface MarkupLinkProps {
  href?: string;
  title?: string;
}

const Code = (props: any) => {
  return <code className="rounded-lg bg-gray-300 px-[5px] py-[2px] text-sm dark:bg-gray-700" {...props} />;
};

const MarkupLink = ({ href, title = href }: MarkupLinkProps) => {
  if (!href) {
    return null;
  }

  // Mentions
  if (href.startsWith('@')) {
    return <Mention href={href} title={title} />;
  }

  // Hashtags
  if (href.startsWith('#')) {
    return <Hashtag href={href} title={title} />;
  }

  return <ExternalLink href={href} title={title} />;
};

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
