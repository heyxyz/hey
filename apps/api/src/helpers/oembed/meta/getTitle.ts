const getTitle = (document: Document): null | string => {
  const og =
    document.querySelector('meta[name="og:title"]') ||
    document.querySelector('meta[property="og:title"]');
  const twitter =
    document.querySelector('meta[name="twitter:title"]') ||
    document.querySelector('meta[property="twitter:title"]');

  if (og) {
    return og.getAttribute("content");
  }

  if (twitter) {
    return twitter.getAttribute("content");
  }

  return null;
};

export default getTitle;
