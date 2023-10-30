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
  return content.replace(regex, '');
};

export default removeUrlsByHostnames;
