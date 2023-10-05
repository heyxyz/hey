import { STATIC_IMAGES_URL } from '@hey/data/constants';
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

  const [src, setSrc] = useState(lowQualitySrc || placeHolderImage);
  const [isLoaded, setIsLoaded] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  console.log('Initial states:', { src, isLoaded, imageLoadFailed });

  const handleLoad = useCallback(() => {
    console.log('Image loaded:', props.src);

    setIsLoaded(true);
    setSrc(props.src || placeHolderImage);
  }, [props.src]);

  const handleError = useCallback(
    (e: SyntheticEvent<HTMLImageElement, Event>) => {
      console.log('Image load error:', e);

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
    console.log('useEffect triggered:', props.src);

    const GlobalImage = window.Image;
    const img = new GlobalImage();
    img.src = props.src || placeHolderImage;
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
        filter: isLoaded ? 'none' : 'blur(10px)'
      }}
      onError={handleError}
      alt={props.alt || ''}
      ref={ref}
    />
  );
});
