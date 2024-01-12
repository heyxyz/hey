import type { Area, Point, Size } from '@hey/image-cropper/types';
import type { Dispatch, FC } from 'react';

import {
  MagnifyingGlassMinusIcon,
  MagnifyingGlassPlusIcon
} from '@heroicons/react/24/outline';
import ImageCropper from '@hey/image-cropper/ImageCropper';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useRef, useState } from 'react';
import useResizeObserver from 'use-resize-observer';
import { useUpdateEffect } from 'usehooks-ts';

interface ImageCropperControllerProps {
  imageSrc: string;
  setCroppedAreaPixels: Dispatch<Area>;
  targetSize: Size;
}

const ImageCropperController: FC<ImageCropperControllerProps> = ({
  imageSrc,
  setCroppedAreaPixels,
  targetSize
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);
  const cropper = useRef<ImageCropper>(null);
  const [cropSize, setCropSize] = useState<Size>(targetSize);
  const { ref: divref, width: divWidth = cropSize.width } =
    useResizeObserver<HTMLDivElement>();

  const onSliderChange = (value: number | number[]) => {
    const logarithmicZoomValue = Array.isArray(value) ? value[0] : value;
    const zoomValue = Math.exp(logarithmicZoomValue);
    setZoom(zoomValue);
    cropper.current?.setNewZoom(zoomValue, null);
  };

  const aspectRatio = targetSize.width / targetSize.height;
  const borderSize = 20;

  useUpdateEffect(() => {
    const newWidth = divWidth - borderSize * 2;
    const newHeight = newWidth / aspectRatio;
    setCropSize({ height: newHeight, width: newWidth });
  }, [divWidth, borderSize, aspectRatio]);

  return (
    <div ref={divref}>
      <ImageCropper
        borderSize={borderSize}
        cropPositionPercent={crop}
        cropSize={cropSize}
        image={imageSrc}
        onCropChange={setCrop}
        onCropComplete={setCroppedAreaPixels}
        onZoomChange={(zoomValue, maxZoomValue) => {
          setZoom(zoomValue);
          setMaxZoom(maxZoomValue);
        }}
        ref={cropper}
        targetSize={targetSize}
        zoom={zoom}
        zoomSpeed={1.2}
      />
      <div
        className="flex py-2"
        style={{ width: cropSize.width + borderSize * 2 }}
      >
        <MagnifyingGlassMinusIcon className="m-1 size-6" />
        <Slider
          className="m-2"
          max={Math.log(maxZoom)}
          min={0}
          onChange={onSliderChange}
          step={0.001}
          value={Math.log(zoom)}
        />
        <MagnifyingGlassPlusIcon className="m-1 size-6" />
      </div>
    </div>
  );
};

export default ImageCropperController;
