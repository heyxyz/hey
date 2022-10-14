/**
 * Sentry ignore
 */
export const denyUrls = [
  // Browser extensions
  /^chrome-extension:\/\//i,
  /^moz-extension:\/\//i,
  /^safari-web-extension:\/\//i
];

export const ignoreErrors = [
  /.*Loading chunk.*/gm,
  /.*Cancel rendering route*/gm,
  /.*currentTarget, detail, isTrusted, target*/gm
];
