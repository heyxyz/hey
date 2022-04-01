import { IMAGEKIT_URL } from 'src/constants'

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
  return height || width
    ? `${IMAGEKIT_URL}/tr:w-${height},h-${width}/${url}`
    : `${IMAGEKIT_URL}/${url}`
}
