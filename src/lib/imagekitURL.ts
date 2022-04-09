import { IMAGEKIT_URL } from 'src/constants'

export function imagekitURL(
  url: string | undefined | null,
  height: string | number = '',
  width: string | number = ''
): string {
  return height || width
    ? `${IMAGEKIT_URL}/tr:w-${height},h-${width}/${url}`
    : `${IMAGEKIT_URL}/${url}`
}
