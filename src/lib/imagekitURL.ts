import { IMAGEKIT_URL } from 'src/constants'

const imagekitURL = (
  url: string | undefined | null,
  height: string | number = '',
  width: string | number = ''
): string => {
  return height || width
    ? `${IMAGEKIT_URL}/tr:w-${height},h-${width}/${url}`
    : `${IMAGEKIT_URL}/${url}`
}

export default imagekitURL
