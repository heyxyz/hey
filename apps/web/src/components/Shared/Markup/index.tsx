import { Regex } from '@hey/data/regex';
import type { ProfileMentioned } from '@hey/lens';
import trimify from '@hey/lib/trimify';
import type { FC } from 'react';
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
  mentions?: ProfileMentioned[];
  className?: string;
}

const Markup: FC<MarkupProps> = ({
  children,
  mentions = [],
  className = ''
}) => {
  if (!children) {
    return null;
  }

  const components = {
    a: (props: any) => {
      return <MarkupLink title={props.title} mentions={mentions} />;
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
