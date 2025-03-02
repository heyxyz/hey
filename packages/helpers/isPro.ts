import extractProTimestamp from "./extractProTimestamp";

const isPro = (username?: string): boolean => {
  if (!username) {
    return false;
  }

  const proExpiresAt = extractProTimestamp(username);

  return proExpiresAt !== null;
};

export default isPro;
