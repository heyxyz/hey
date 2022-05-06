import { HashtagMatcher } from '@components/utils/matchers/HashtagMatcher'
import { MDBoldMatcher } from '@components/utils/matchers/markdown/MDBoldMatcher'
import { MDCodeMatcher } from '@components/utils/matchers/markdown/MDCodeMatcher'
import { MDItalicMatcher } from '@components/utils/matchers/markdown/MDItalicMatcher'
import { MentionMatcher } from '@components/utils/matchers/MentionMatcher'
import { Interweave } from 'interweave'
import { EmailMatcher, UrlMatcher } from 'interweave-autolink'
import React, { FC } from 'react'

interface Props {
  children: string
}

const Markup: FC<Props> = ({ children }) => {
  return (
    <Interweave
      content={children}
      matchers={[
        new UrlMatcher('url'),
        new EmailMatcher('email'),
        new HashtagMatcher('hashtag'),
        new MentionMatcher('mention'),
        new MDBoldMatcher('mdBold'),
        new MDItalicMatcher('mdItalic'),
        new MDCodeMatcher('mdCode')
      ]}
    />
  )
}

export default Markup
