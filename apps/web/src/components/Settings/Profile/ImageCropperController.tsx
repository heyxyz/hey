import 'rc-slider/assets/index.css';

import { ZoomInIcon, ZoomOutIcon } from '@heroicons/react/outline';
import ImageCropper from 'image-cropper/ImageCropper';
import type { Area, Point, Size } from 'image-cropper/types';
import Slider from 'rc-slider';
import type { Dispatch, FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import useResizeObserver from 'use-resize-observer';

interface ImageCropperControllerProps {
  targetSize: Size;
  imageSrc: string;
  setCroppedAreaPixels: Dispatch<Area>;
}

const ImageCropperController: FC<ImageCropperControllerProps> = ({
  targetSize,
  imageSrc,
  setCroppedAreaPixels
}) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [maxZoom, setMaxZoom] = useState(1);
  const cropper = useRef<ImageCropper>(null);
  const [cropSize, setCropSize] = useState<Size>(targetSize);
  const { ref: divref, width: divWidth = cropSize.width } = useResizeObserver<HTMLDivElement>();

  const onSliderChange = (value: number | number[]) => {
    const logarithmicZoomValue = Array.isArray(value) ? value[0] : value;
    const zoomValue = Math.exp(logarithmicZoomValue);
    setZoom(zoomValue);
    cropper.current?.setNewZoom(zoomValue, null);
  };

  const aspectRatio = targetSize.width / targetSize.height;
  const borderSize = 20;

  useEffect(() => {
    const newWidth = divWidth - borderSize * 2;
    const newHeight = newWidth / aspectRatio;
    setCropSize({ width: newWidth, height: newHeight });
  }, [divWidth, borderSize, aspectRatio]);

  return (
    <div ref={divref}>
      <ImageCropper
        ref={cropper}
        image={imageSrc}
        cropSize={cropSize}
        targetSize={targetSize}
        borderSize={borderSize}
        cropPositionPercent={crop}
        zoom={zoom}
        zoomSpeed={1.2}
        onCropChange={setCrop}
        onCropComplete={setCroppedAreaPixels}
        onZoomChange={(zoomValue, maxZoomValue) => {
          setZoom(zoomValue);
          setMaxZoom(maxZoomValue);
        }}
      />
      <div className="flex pb-2 pt-2" style={{ width: cropSize.width + borderSize * 2 }}>
        <ZoomOutIcon className="m-1 h-6 w-6" />
        <Slider
          className="m-2"
          min={0}
          max={Math.log(maxZoom)}
          step={0.001}
          onChange={onSliderChange}
          value={Math.log(zoom)}
        />
        <ZoomInIcon className="m-1 h-6 w-6" />
      </div>
    </div>
  );
};

export default ImageCropperController;
