import {
  LOADING_PLACEHOLDER_IMAGE_PATH,
  STATIC_IMAGES_URL
} from '@hey/data/constants';
import type {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  Ref,
  SyntheticEvent
} from 'react';
import { forwardRef, useCallback, useEffect, useState } from 'react';

export const Image = forwardRef(function Image(
  {
    onError,
    lowQualitySrc,
    ...props
  }: DetailedHTMLProps<
    ImgHTMLAttributes<HTMLImageElement>,
    HTMLImageElement
  > & {
    lowQualitySrc?: string;
  },
  ref: Ref<HTMLImageElement>
) {
  const placeHolderImage = `${STATIC_IMAGES_URL}/placeholder.webp`;

  const [src, setSrc] = useState(
    lowQualitySrc || LOADING_PLACEHOLDER_IMAGE_PATH
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    setSrc(props.src || placeHolderImage);
  }, [props.src]);

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      if (imageLoadFailed) {
        return;
      }
      setImageLoadFailed(true);
      if (onError) {
        onError(e);
      }
    },
    [imageLoadFailed, setImageLoadFailed, onError]
  );

  useEffect(() => {
    const GlobalImage = window.Image;
    const img = new GlobalImage();
    img.src = props.src || LOADING_PLACEHOLDER_IMAGE_PATH;
    img.onload = handleLoad;
    return () => {
      img.onload = null;
    };
  }, [props.src, handleLoad]);

  console.log('Rendering with states:', { src, isLoaded, imageLoadFailed });

  return (
    <img
      {...props}
      src={imageLoadFailed ? `${STATIC_IMAGES_URL}/placeholder.webp` : src}
      style={{
        opacity: isLoaded ? 1 : 0.5,
        filter: isLoaded ? 'none' : 'blur(5px)',

        transition: 'opacity .5s ease-out'
      }}
      onError={handleError}
      alt={props.alt || ''}
      ref={ref}
    />
  );
});
