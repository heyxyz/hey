import { IMAGEKIT_URL } from 'src/constants'

const imagekitURL = (url: string, height?: number, width?: number): string => {
  return height || width
    ? `${IMAGEKIT_URL}/tr:w-${height?.toString()},h-${width?.toString()}/${url}`
    : `${IMAGEKIT_URL}/${url}`
}

export default imagekitURL
