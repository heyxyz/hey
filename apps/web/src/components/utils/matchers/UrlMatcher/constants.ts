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

const VALID_PATH_CHARS = /[\w!$%&'()*+,./;=[\\\]~\u0400-\u04FF\-]*/u;
const URL_SCHEME = combinePatterns([/(https?:\/\/)?/], { capture: true });

const URL_HOST = combinePatterns(
  [
    /(?:[\da-z](?:[\d_a-z-]*[\da-z])?\.)*/, // Subdomain
    /(?:[\da-z](?:[\da-z-]*[\da-z])?\.)/, // Domain
    /(?:[a-z](?:[\da-z-]*[\da-z])?)/ // TLD
  ],
  { capture: true }
);

const URL_PATH = combinePatterns(
  [
    /\//,
    combinePatterns(
      [
        /[\d!$%&'()*+,./:;=@[\]_a-z|~-]*/,
        /[\d()+/a-z-]/ // Valid ending chars
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
        /[\d&=_a-z]/ // Valid ending chars
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
        /[\da-z]/ // Valid ending chars
      ],
      { match: '?', nonCapture: true }
    )
  ],
  { capture: true, match: '?' }
);

export const URL_PATTERN = combinePatterns([URL_SCHEME, URL_HOST, URL_PATH, URL_QUERY, URL_FRAGMENT], {
  flags: 'i'
});

export const PARENTHESES_URL_PATTERN = new RegExp(`\\((${URL_PATTERN.source})\\)`, 'i');

export const URL_TRUNCATE_LENGTH = 25;
export const PATH_MIN_LENGTH = 5;

export const BLOCKED_TLDS = ['lens'];
