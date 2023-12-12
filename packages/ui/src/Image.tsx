import type {
  DetailedHTMLProps,
  ImgHTMLAttributes,
  Ref,
  SyntheticEvent
} from 'react';

import { PLACEHOLDER_IMAGE } from '@hey/data/constants';
import { forwardRef, useCallback, useEffect, useState } from 'react';

export const Image = forwardRef(function Image(
  {
    onError,
    ...props
  }: DetailedHTMLProps<ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>,
  ref: Ref<HTMLImageElement>
) {
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setImageLoadFailed(false);
  }, [props.src]);

  return (
    <img
      {...props}
      alt={props.alt || ''}
      onError={handleError}
      ref={ref}
      src={imageLoadFailed ? PLACEHOLDER_IMAGE : props.src}
    />
  );
});
