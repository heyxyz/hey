const removeUrlsByHostnames = (
  content: string,
  hostnames: Set<string>
): string => {
  const regexPattern = Array.from(hostnames)
    .map(
      (hostname) =>
        `https?:\\/\\/(www\\.)?${hostname.replace('.', '\\.')}[\\S]+`
    )
    .join('|');
  const regex = new RegExp(regexPattern, 'g');

  return content
    .replace(regex, '')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

export default removeUrlsByHostnames;
