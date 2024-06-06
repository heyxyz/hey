import type { ProfileMentioned } from '@good/lens';
import type { FC } from 'react';

import { Regex } from '@good/data/regex';
import trimify from '@good/helpers/trimify';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';
// @ts-expect-error
import linkifyRegex from 'remark-linkify-regex';
import stripMarkdown from 'strip-markdown';

import Code from './Code';
import MarkupLink from './MarkupLink';

const plugins = [
  [stripMarkdown, { keep: ['strong', 'emphasis', 'inlineCode', 'delete'] }],
  remarkBreaks,
  linkifyRegex(Regex.url),
  linkifyRegex(Regex.mention),
  linkifyRegex(Regex.hashtag),
  linkifyRegex(Regex.cashtag)
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
