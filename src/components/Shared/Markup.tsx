import { HashtagMatcher } from '@components/utils/matchers/HashtagMatcher'
import { MDBoldMatcher } from '@components/utils/matchers/markdown/MDBoldMatcher'
import { MDCodeMatcher } from '@components/utils/matchers/markdown/MDCodeMatcher'
import { MDItalicMatcher } from '@components/utils/matchers/markdown/MDItalicMatcher'
import { MDQuoteMatcher } from '@components/utils/matchers/markdown/MDQuoteMatcher'
import { MDStrikeMatcher } from '@components/utils/matchers/markdown/MDStrikeMatcher'
import { MentionMatcher } from '@components/utils/matchers/MentionMatcher'
import { SpoilerMatcher } from '@components/utils/matchers/SpoilerMatcher'
import trimify from '@lib/trimify'
import { Interweave } from 'interweave'
import { EmailMatcher, UrlMatcher } from 'interweave-autolink'
import React, { FC } from 'react'

interface Props {
  children: string
}

const Markup: FC<Props> = ({ children }) => {
  return (
    <Interweave
      content={trimify(children)}
      matchers={[
        new UrlMatcher('url'),
        new EmailMatcher('email'),
        new HashtagMatcher('hashtag'),
        new MentionMatcher('mention'),
        new MDBoldMatcher('mdBold'),
        new MDItalicMatcher('mdItalic'),
        new MDStrikeMatcher('mdStrike'),
        new MDQuoteMatcher('mdQuote'),
        new MDCodeMatcher('mdCode'),
        new SpoilerMatcher('spoiler')
      ]}
    />
  )
}

export default Markup
