import urlcat from "urlcat";

/**
 * Get favicon from google
 * @param url The url to get the favicon from.
 * @returns The favicon url or null if the URL is invalid.
 */
const getFavicon = (url: string) => {
  try {
    const { hostname } = new URL(url);

    return urlcat("https://external-content.duckduckgo.com/ip3/:domain.ico", {
      domain: hostname || "unknowndomain"
    });
  } catch {
    return "https://external-content.duckduckgo.com/ip3/unknowndomain.ico";
  }
};

export default getFavicon;
