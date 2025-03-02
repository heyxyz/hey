const extractProTimestamp = (username?: string): string | null => {
  if (!username) {
    return null;
  }

  const parts = username.split("-");
  if (parts.length !== 2 || Number.isNaN(Number(parts[1]))) {
    throw new Error("Invalid username format");
  }

  const epoch = Number(parts[1]);
  const now = Math.floor(Date.now() / 1000);

  if (epoch < now) {
    return null;
  }

  return new Date(epoch * 1000).toISOString();
};

export default extractProTimestamp;
