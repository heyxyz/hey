import { HashtagMatcher } from '@components/utils/matchers/HashtagMatcher'
import { MDBoldMatcher } from '@components/utils/matchers/markdown/MDBoldMatcher'
import { MDCodeMatcher } from '@components/utils/matchers/markdown/MDCodeMatcher'
import { MDQuoteMatcher } from '@components/utils/matchers/markdown/MDQuoteMatcher'
import { MDStrikeMatcher } from '@components/utils/matchers/markdown/MDStrikeMatcher'
import { MentionMatcher } from '@components/utils/matchers/MentionMatcher'
import { SpoilerMatcher } from '@components/utils/matchers/SpoilerMatcher'
import trimify from '@lib/trimify'
import { Interweave } from 'interweave'
import { UrlMatcher } from 'interweave-autolink'
import React, { FC, MouseEvent } from 'react'

interface Props {
  children: string
}

const Markup: FC<Props> = ({ children }) => {
  return (
    <Interweave
      content={trimify(children)}
      escapeHtml
      allowList={['b', 'i', 'a', 'br', 'code', 'span']}
      newWindow
      onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}
      matchers={[
        new HashtagMatcher('hashtag'),
        new MentionMatcher('mention'),
        new MDBoldMatcher('mdBold'),
        // new MDItalicMatcher('mdItalic'),
        new MDStrikeMatcher('mdStrike'),
        new MDQuoteMatcher('mdQuote'),
        new MDCodeMatcher('mdCode'),
        new SpoilerMatcher('spoiler'),
        new UrlMatcher('url', { validateTLD: false })
      ]}
    />
  )
}

export default Markup
