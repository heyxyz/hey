import type { Document } from "linkedom";

const getDescription = (document: Document): null | string => {
  const lens =
    document.querySelector('meta[name="lens:description"]') ||
    document.querySelector('meta[property="lens:description"]');
  const og =
    document.querySelector('meta[name="og:description"]') ||
    document.querySelector('meta[property="og:description"]');
  const twitter =
    document.querySelector('meta[name="twitter:description"]') ||
    document.querySelector('meta[property="twitter:description"]');

  if (lens) {
    return lens.getAttribute("content");
  }

  if (og) {
    return og.getAttribute("content");
  }

  if (twitter) {
    return twitter.getAttribute("content");
  }

  return null;
};

export default getDescription;
