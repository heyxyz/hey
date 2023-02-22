import type { Area, MediaSize, Point, Size } from './types';

export function restrictValue(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function restrictPositionCoord(position: number, mediaSize: number, cropSize: number, zoom: number): number {
  const maxPosition = (mediaSize * zoom) / 2 - cropSize / 2;
  return restrictValue(position, -maxPosition, maxPosition);
}

export function restrictPosition(position: Point, mediaSize: Size, cropSize: Size, zoom: number): Point {
  return {
    x: restrictPositionCoord(position.x, mediaSize.width, cropSize.width, zoom),
    y: restrictPositionCoord(position.y, mediaSize.height, cropSize.height, zoom)
  };
}

export function getDistanceBetweenPoints(pointA: Point, pointB: Point) {
  return Math.sqrt(Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2));
}

export function computeCroppedArea(
  cropPosition: Point,
  cropSize: Size,
  mediaSize: MediaSize,
  zoom: number
): { croppedAreaPixels: Area } {
  const mediaScale = mediaSize.naturalWidth / mediaSize.width;
  const fitWidth = mediaSize.width / mediaSize.height < cropSize.width / cropSize.height;
  const cropSizePixels = fitWidth
    ? {
        width: mediaSize.naturalWidth / zoom,
        height: (mediaSize.naturalWidth * (cropSize.height / cropSize.width)) / zoom
      }
    : {
        width: (mediaSize.naturalHeight * (cropSize.width / cropSize.height)) / zoom,
        height: mediaSize.naturalHeight / zoom
      };

  const cropAreaCenterPixelX = (-cropPosition.x * mediaScale) / zoom;
  const cropAreaCenterPixelY = (-cropPosition.y * mediaScale) / zoom;
  const croppedAreaPixels = {
    ...cropSizePixels,
    x: cropAreaCenterPixelX - cropSizePixels.width / 2 + mediaSize.naturalWidth / 2,
    y: cropAreaCenterPixelY - cropSizePixels.height / 2 + mediaSize.naturalHeight / 2
  };
  return { croppedAreaPixels };
}

export function getMidpoint(a: Point, b: Point): Point {
  return {
    x: (b.x + a.x) / 2,
    y: (b.y + a.y) / 2
  };
}

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', (error) => reject(error));
    image.src = url;
  });

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area | null
): Promise<HTMLCanvasElement | null> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx || !pixelCrop) {
    return null;
  }

  canvas.width = image.width;
  canvas.height = image.height;
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  ctx.putImageData(data, 0, 0);

  return canvas;
}
