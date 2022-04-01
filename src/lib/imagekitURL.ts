/**
 * Creates Imagekit CDN URL
 * @param url - URL which need to be CDNified
 * @param height - Height of the image
 * @param width - Width of the image
 * @returns cdn url of the passed URL
 */
export function imagekitURL(
  url: string | undefined | null,
  height: string | number = '',
  width: string | number = ''
): string {
  const cdn = 'https://ik.imagekit.io/lenster'
  return height || width
    ? `${cdn}/tr:w-${height},h-${width}/${url}`
    : `${cdn}/${url}`
}
