import { HashtagMatcher } from '@components/utils/matchers/HashtagMatcher';
import { MDBoldMatcher } from '@components/utils/matchers/markdown/MDBoldMatcher';
import { MDCodeMatcher } from '@components/utils/matchers/markdown/MDCodeMatcher';
import { MDItalicMatcher } from '@components/utils/matchers/markdown/MDItalicMatcher';
import { MDLinkMatcher } from '@components/utils/matchers/markdown/MDLinkMatcher';
import { MDQuoteMatcher } from '@components/utils/matchers/markdown/MDQuoteMatcher';
import { MDStrikeMatcher } from '@components/utils/matchers/markdown/MDStrikeMatcher';
import { MentionMatcher } from '@components/utils/matchers/MentionMatcher';
import { SpoilerMatcher } from '@components/utils/matchers/SpoilerMatcher';
import { UrlMatcher } from '@components/utils/matchers/UrlMatcher';
import trimify from '@lib/trimify';
import { Interweave } from 'interweave';
import type { FC, MouseEvent } from 'react';

interface Props {
  children: string;
  className?: string;
  matchOnlyUrl?: boolean;
}

const Markup: FC<Props> = ({ children, className = '', matchOnlyUrl }) => {
  const defaultMatchers = [
    new UrlMatcher('url'),
    new HashtagMatcher('hashtag'),
    new MentionMatcher('mention'),
    new MDBoldMatcher('mdBold'),
    new MDItalicMatcher('mdItalic'),
    new MDLinkMatcher('mdLink'),
    new MDStrikeMatcher('mdStrike'),
    new MDQuoteMatcher('mdQuote'),
    new MDCodeMatcher('mdCode'),
    new SpoilerMatcher('spoiler')
  ];

  return (
    <Interweave
      className={className}
      content={trimify(children)}
      escapeHtml
      allowList={['b', 'i', 'a', 'br', 'code', 'span']}
      matchers={matchOnlyUrl ? [new UrlMatcher('url')] : defaultMatchers}
      onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
    />
  );
};

export default Markup;
