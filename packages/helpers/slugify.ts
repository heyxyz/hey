const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^\d a-z-]/g, "") // Remove invalid chars
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(/-+/g, "-"); // Replace multiple - with single -

export default slugify;
