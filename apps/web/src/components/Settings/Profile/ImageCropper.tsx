import type { Dispatch, FC } from 'react';
import { useState } from 'react';
import type { Area, Point } from 'react-easy-crop';
import Cropper from 'react-easy-crop';

interface Props {
  imageSrc: string;
  setCroppedAreaPixels: Dispatch<Area>;
}

const ImageCropper: FC<Props> = ({ imageSrc, setCroppedAreaPixels }) => {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative h-60 w-60">
      <Cropper
        image={imageSrc}
        crop={crop}
        zoom={zoom}
        zoomSpeed={0.2}
        aspect={1.0}
        cropShape="round"
        showGrid={false}
        onCropChange={setCrop}
        onCropComplete={(_croppedArea, croppedAreaPixels) => {
          setCroppedAreaPixels(croppedAreaPixels);
        }}
        onZoomChange={setZoom}
      />
    </div>
  );
};

export default ImageCropper;
