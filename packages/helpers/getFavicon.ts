import urlcat from "urlcat";

/**
 * Get favicon from google
 * @param url The url to get the favicon from.
 * @returns The favicon url.
 */
const getFavicon = (url: string) => {
  const { hostname } = new URL(url);

  return urlcat("https://external-content.duckduckgo.com/ip3/:domain.ico", {
    domain: hostname || "unknowndomain"
  });
};

export default getFavicon;
