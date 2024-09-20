const getTweet = (url: string): null | string => {
  try {
    const parsedUrl = new URL(url);
    if (
      parsedUrl.hostname === "twitter.com" ||
      parsedUrl.hostname === "x.com"
    ) {
      const parts = parsedUrl.pathname.split("/");
      if (parts.length === 4 && parts[2] === "status") {
        return parts[3];
      }

      return null;
    }

    return null;
  } catch {
    return null;
  }
};

export default getTweet;
