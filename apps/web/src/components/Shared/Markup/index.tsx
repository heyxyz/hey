import type { ProfileMentioned } from '@hey/lens';
import type { FC } from 'react';

import { Regex } from '@hey/data/regex';
import trimify from '@hey/lib/trimify';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
// @ts-expect-error
import linkifyRegex from 'remark-linkify-regex';
import stripMarkdown from 'strip-markdown';

import Code from './Code';
import MarkupLink from './MarkupLink';

const plugins = [
  [stripMarkdown, { keep: ['strong', 'emphasis', 'inlineCode'] }],
  remarkBreaks,
  linkifyRegex(Regex.url),
  linkifyRegex(Regex.mention),
  linkifyRegex(Regex.hashtag)
];

interface MarkupProps {
  children: string;
  className?: string;
  mentions?: ProfileMentioned[];
}

const Markup: FC<MarkupProps> = ({
  children,
  className = '',
  mentions = []
}) => {
  if (!children) {
    return null;
  }

  const components = {
    a: (props: any) => {
      return <MarkupLink mentions={mentions} title={props.title} />;
    },
    code: Code
  };

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
