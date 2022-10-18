import { HashtagMatcher } from '@components/utils/matchers/HashtagMatcher';
import { MDBoldMatcher } from '@components/utils/matchers/markdown/MDBoldMatcher';
import { MDCodeMatcher } from '@components/utils/matchers/markdown/MDCodeMatcher';
import { MDLinkMatcher } from '@components/utils/matchers/markdown/MDLinkMatcher';
import { MDQuoteMatcher } from '@components/utils/matchers/markdown/MDQuoteMatcher';
import { MDStrikeMatcher } from '@components/utils/matchers/markdown/MDStrikeMatcher';
import { MentionMatcher } from '@components/utils/matchers/MentionMatcher';
import { SpoilerMatcher } from '@components/utils/matchers/SpoilerMatcher';
import trimify from '@lib/trimify';
import { Interweave } from 'interweave';
import { UrlMatcher } from 'interweave-autolink';
import type { FC, MouseEvent } from 'react';

interface Props {
  children: string;
  className?: string;
}

const Markup: FC<Props> = ({ children, className = '' }) => {
  return (
    <Interweave
      className={className}
      content={trimify(children)}
      escapeHtml
      allowList={['b', 'i', 'a', 'br', 'code', 'span']}
      newWindow
      matchers={[
        new HashtagMatcher('hashtag'),
        new MentionMatcher('mention'),
        new MDBoldMatcher('mdBold'),
        new MDLinkMatcher('mdLink'),
        new MDStrikeMatcher('mdStrike'),
        new MDQuoteMatcher('mdQuote'),
        new MDCodeMatcher('mdCode'),
        new SpoilerMatcher('spoiler'),
        new UrlMatcher('url', { validateTLD: false })
      ]}
      onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
    />
  );
};

export default Markup;
