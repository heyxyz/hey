import type { ChildrenNode, MatchResponse, Node } from 'interweave';
import { Matcher } from 'interweave';
import Link from 'next/link';
import { createElement } from 'react';

import {
  BLOCKED_TLDS,
  PARENTHESES_URL_PATTERN,
  PATH_MIN_LENGTH,
  URL_PATTERN,
  URL_TRUNCATE_LENGTH
} from './constants';

interface UrlProps {
  children: ChildrenNode;
  url: string;
  host: string;
  fullPath: string;
}

const shortUrl = (props: UrlProps): string => {
  if (props.host === location.host) {
    return props.host + props.fullPath;
  }

  const truncatedPathLength = Math.max(URL_TRUNCATE_LENGTH - props.host.length, PATH_MIN_LENGTH);
  let doTruncate = props.fullPath.length - truncatedPathLength > 3;
  return props.host + (doTruncate ? props.fullPath.substring(0, truncatedPathLength) + '…' : props.fullPath);
};

const Url = ({ children, url }: UrlProps) => {
  let href = url;

  if (!href.match(/^https?:\/\//)) {
    href = `http://${href}`;
  }

  return (
    <Link
      href={href}
      target={href.includes(location.host) ? '_self' : '_blank'}
      onClick={(event) => event.stopPropagation()}
      rel="noopener"
    >
      {children}
    </Link>
  );
};

type UrlMatch = Pick<UrlProps, 'url' | 'host' | 'fullPath'>;

export class UrlMatcher extends Matcher<UrlProps> {
  replaceWith(children: ChildrenNode, props: UrlProps): Node {
    return createElement(Url, props, shortUrl(props));
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
      host: matches[3],
      fullPath: (matches[4] ?? '') + (matches[5] ?? '') + (matches[6] ?? '')
    };
  }
}

export class ParenthesesUrlMatcher extends UrlMatcher {
  replaceWith(children: ChildrenNode, props: UrlProps): Node {
    return <>({createElement(Url, props, shortUrl(props))})</>;
  }

  getPattern(): RegExp {
    return PARENTHESES_URL_PATTERN;
  }

  handleMatches(matches: string[]): UrlMatch {
    return {
      url: matches[1],
      host: matches[4],
      fullPath: (matches[5] ?? '') + (matches[6] ?? '') + (matches[7] ?? '')
    };
  }
}
