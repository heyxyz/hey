// checks if url contains valid tld

import tlds from 'tlds';

export const isUrlContainsValidTld = (url: string) => {
  const lowerCaseUrl = url.toLowerCase();
  return tlds.some((tld) => {
    const regex = new RegExp(`\\.${tld.toLowerCase()}([/?#]|$)`);
    return regex.test(lowerCaseUrl);
  });
};
