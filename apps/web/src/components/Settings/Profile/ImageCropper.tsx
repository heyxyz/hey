import Cropper from '@lib/image-cropper/Cropper';
import type { Area, Point } from '@lib/image-cropper/types';
import type { Dispatch, FC } from 'react';
import { useState } from 'react';

interface Props {
  size: number;
  imageSrc: string;
  setCroppedAreaPixels: Dispatch<Area>;
}

const ImageCropper: FC<Props> = ({ size, imageSrc, setCroppedAreaPixels }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <Cropper
      image={imageSrc}
      size={size}
      borderSize={20}
      crop={crop}
      zoom={zoom}
      zoomSpeed={1.2}
      showGrid={false}
      onCropChange={setCrop}
      onCropComplete={(croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
      }}
      onZoomChange={setZoom}
    />
  );
};

export default ImageCropper;
