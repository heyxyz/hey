import type { ChildrenNode, MatchResponse, Node } from 'interweave';
import { Matcher } from 'interweave';
import type { ComponentType } from 'react';
import { createElement } from 'react';

import { BLOCKED_TLDS, URL_PATTERN } from './constants';
import type { UrlMatcherOptions, UrlProps } from './types';

const Url = ({ children, url }: UrlProps) => {
  let href = url;

  if (!href.match(/^https?:\/\//)) {
    href = `http://${href}`;
  }

  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a href={href} target="_blank">
      {children}
    </a>
  );
};

type UrlMatch = Pick<UrlProps, 'url' | 'urlParts'>;

export class UrlMatcher extends Matcher<UrlProps, UrlMatcherOptions> {
  constructor(name: string, options?: UrlMatcherOptions, factory?: ComponentType<UrlProps> | null) {
    super(name, { ...options }, factory);
  }

  replaceWith(children: ChildrenNode, props: UrlProps): Node {
    return createElement(Url, props, children);
  }

  asTag(): string {
    return 'a';
  }

  match(string: string): MatchResponse<UrlMatch> | null {
    const response = this.doMatch(string, URL_PATTERN, this.handleMatches);

    if (response?.valid) {
      const { host } = response.urlParts as unknown as UrlProps['urlParts'];
      const tld = host.slice(host.lastIndexOf('.') + 1).toLowerCase();

      if (BLOCKED_TLDS.includes(tld)) {
        return null;
      }
    }

    return response;
  }

  /**
   * Package the matched response.
   */
  handleMatches(matches: string[]): UrlMatch {
    return {
      url: matches[0],
      urlParts: {
        auth: matches[2] ? matches[2].slice(0, -1) : '',
        fragment: matches[7] || '',
        host: matches[3],
        path: matches[5] || '',
        port: matches[4] ? matches[4] : '',
        query: matches[6] || '',
        scheme: matches[1] ? matches[1].replace('://', '') : 'http'
      }
    };
  }
}
