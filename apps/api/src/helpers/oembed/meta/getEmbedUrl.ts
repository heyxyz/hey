const getEmbedUrl = (
  document: Document,
  preferPlayer = false
): null | string => {
  const og =
    document.querySelector('meta[name="og:video:url"]') ||
    document.querySelector('meta[name="og:video:secure_url"]') ||
    document.querySelector('meta[property="og:video:url"]') ||
    document.querySelector('meta[property="og:video:secure_url"]');
  const twitter =
    document.querySelector('meta[name="twitter:player"]') ||
    document.querySelector('meta[property="twitter:player"]');

  if (preferPlayer && twitter) {
    return twitter.getAttribute("content");
  }

  return (og || twitter)?.getAttribute("content") ?? null;
};

export default getEmbedUrl;
