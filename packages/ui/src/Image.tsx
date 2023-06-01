import { STATIC_IMAGES_URL } from '@lenster/data/constants';
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
    ...props
  }: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  ref: Ref<HTMLImageElement>
) {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

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
    setImageLoadFailed(false);
  }, [props.src]);

  return (
    <img
      {...props}
      src={
        imageLoadFailed ? `${STATIC_IMAGES_URL}/placeholder.webp` : props.src
      }
      onError={handleError}
      alt={props.alt || ''}
      ref={ref}
    />
  );
});
