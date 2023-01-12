import type { ChildrenNode, MatchResponse, Node } from 'interweave';
import { Matcher } from 'interweave';
import { createElement } from 'react';

import { BLOCKED_TLDS, PARENTHESES_URL_PATTERN, URL_PATTERN } from './constants';

interface UrlProps {
  children: ChildrenNode;
  url: string;
  host: string;
}

const Url = ({ children, url }: UrlProps) => {
  let href = url;

  if (!href.match(/^https?:\/\//)) {
    href = `http://${href}`;
  }

  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a href={href} target="_blank" onClick={(event) => event.stopPropagation()} rel="noopener">
      {children}
    </a>
  );
};

type UrlMatch = Pick<UrlProps, 'url' | 'host'>;

export class UrlMatcher extends Matcher<UrlProps> {
  replaceWith(children: ChildrenNode, props: UrlProps): Node {
    return createElement(Url, props, children);
  }

  getPattern(): RegExp {
    return URL_PATTERN;
  }

  asTag(): string {
    return 'a';
  }

  match(string: string): MatchResponse<UrlMatch> | null {
    const response = this.doMatch(string, this.getPattern(), this.handleMatches, true);

    if (response?.valid) {
      const { host } = response;
      const tld = host.slice(host.lastIndexOf('.') + 1).toLowerCase();

      if (BLOCKED_TLDS.includes(tld)) {
        response.valid = false;
      }
    }

    return response;
  }

  handleMatches(matches: string[]): UrlMatch {
    return {
      url: matches[0],
      host: matches[3]
    };
  }
}

export class ParenthesesUrlMatcher extends UrlMatcher {
  replaceWith(children: ChildrenNode, props: UrlProps): Node {
    return <>({createElement(Url, props, props.url)})</>;
  }

  getPattern(): RegExp {
    return PARENTHESES_URL_PATTERN;
  }

  handleMatches(matches: string[]): UrlMatch {
    return {
      url: matches[1],
      host: matches[4]
    };
  }
}
