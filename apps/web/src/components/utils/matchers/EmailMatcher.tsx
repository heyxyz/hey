import type { ChildrenNode, MatchResponse, Node } from 'interweave';
import { Matcher } from 'interweave';
import type { LinkProps } from 'next/link';
import Link from 'next/link';
import React from 'react';

import { combinePatterns, EMAIL_USERNAME, URL_HOST } from './constants';

const EMAIL_PATTERN = combinePatterns([EMAIL_USERNAME, URL_HOST], {
  flags: 'i',
  join: '@'
});

interface EmailProps extends Partial<LinkProps> {
  children: ChildrenNode;
  email: string;
  emailParts: {
    host: string;
    username: string;
  };
}

export function Email({ children, email, ...props }: EmailProps) {
  return (
    <Link {...props} href={`mailto:${email}`}>
      {children}
    </Link>
  );
}

export type EmailMatch = Pick<EmailProps, 'email' | 'emailParts'>;

export class EmailMatcher extends Matcher<EmailProps> {
  replaceWith(children: ChildrenNode, props: EmailProps): Node {
    return React.createElement(Email, props, children);
  }

  asTag(): string {
    return 'a';
  }

  match(string: string): MatchResponse<EmailMatch> | null {
    return this.doMatch(string, EMAIL_PATTERN, (matches) => ({
      email: matches[0],
      emailParts: {
        host: matches[2],
        username: matches[1]
      }
    }));
  }
}
