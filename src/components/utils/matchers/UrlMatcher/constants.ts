/* eslint-disable unicorn/better-regex, unicorn/no-unsafe-regex */

interface CombinePatternsOptions {
  capture?: boolean;
  flags?: string;
  join?: string;
  match?: string;
  nonCapture?: boolean;
}

const combinePatterns = (patterns: RegExp[], options: CombinePatternsOptions = {}) => {
  let regex = patterns.map((pattern) => pattern.source).join(options.join ?? '');

  if (options.capture) {
    regex = `(${regex})`;
  } else if (options.nonCapture) {
    regex = `(?:${regex})`;
  }

  if (options.match) {
    regex += options.match;
  }

  return new RegExp(regex, options.flags ?? '');
};

// https://www.ietf.org/rfc/rfc3986.txt
// https://blog.codinghorror.com/the-problem-with-urls/
// http://www.regular-expressions.info/email.html

const VALID_ALNUM_CHARS = /[a-z0-9]/;
const VALID_PATH_CHARS = /(?:[a-zA-Z\u0400-\u04FF0-9\-_~!$&'()[\]\\/*+,;=.%]*)/;
const URL_SCHEME = /(https?:\/\/)?/;

const URL_AUTH = combinePatterns(
  [
    /[a-z\u0400-\u04FF0-9\-_~!$&'()*+,;=.:]+/, // Includes colon
    /@/
  ],
  { capture: true, match: '?' }
);

const URL_HOST = combinePatterns(
  [
    /(?:(?:[a-z0-9](?:[-a-z0-9_]*[a-z0-9])?)\.)*/, // Subdomain
    /(?:(?:[a-z0-9](?:[-a-z0-9]*[a-z0-9])?)\.)/, // Domain
    /(?:[a-z](?:[-a-z0-9]*[a-z0-9])?)/ // TLD
  ],
  {
    capture: true
  }
);

const URL_PORT = /(?::(\d{1,5}))?/;
const URL_PATH = combinePatterns(
  [
    /\//,
    combinePatterns(
      [
        /[-+a-z0-9!*';:=,.$/%[\]_~@|&]*/,
        /[-+a-z0-9/]/ // Valid ending chars
      ],
      { match: '*', nonCapture: true }
    )
  ],
  { capture: true, match: '?' }
);

const URL_QUERY = combinePatterns(
  [
    /\?/,
    combinePatterns(
      [
        VALID_PATH_CHARS,
        /[a-z0-9_&=]/ // Valid ending chars
      ],
      { match: '?', nonCapture: true }
    )
  ],
  { capture: true, match: '?' }
);

const URL_FRAGMENT = combinePatterns(
  [
    /#/,
    combinePatterns(
      [
        VALID_PATH_CHARS,
        /[a-z0-9]/ // Valid ending chars
      ],
      { match: '?', nonCapture: true }
    )
  ],
  { capture: true, match: '?' }
);

export const URL_PATTERN = combinePatterns(
  [URL_SCHEME, URL_AUTH, URL_HOST, URL_PORT, URL_PATH, URL_QUERY, URL_FRAGMENT],
  { flags: 'i' }
);

export const BLOCKED_TLDS = ['lens'];
