import clsx from 'clsx';
import normalizeWheel from 'normalize-wheel';
import React from 'react';

import {
  computeCroppedArea,
  getDistanceBetweenPoints,
  getMidpoint,
  restrictPosition,
  restrictValue
} from './cropUtils';
import type { Area, MediaSize, Point, Size } from './types';

interface CropperProps {
  image?: string;
  cropSize: Size;
  cropPosition: Point;
  borderSize: number;
  zoom: number;
  zoomSpeed: number;
  onCropChange: (location: Point) => void;
  onZoomChange?: (zoom: number, maxZoom: number) => void;
  onCropComplete?: (croppedAreaPixels: Area) => void;
}

type State = {
  hasWheelJustStarted: boolean;
};

type GestureEvent = UIEvent & {
  scale: number;
  clientX: number;
  clientY: number;
};

class ImageCropper extends React.Component<CropperProps, State> {
  static defaultProps = {
    zoom: 1,
    zoomSpeed: 1
  };

  imageRef: React.RefObject<HTMLImageElement> = React.createRef();
  containerRef: HTMLDivElement | null = null;
  styleRef: HTMLStyleElement | null = null;
  mediaSize: MediaSize = { width: 0, height: 0, naturalWidth: 0, naturalHeight: 0 };
  maxZoom: number | null = null;
  dragStartPosition: Point = { x: 0, y: 0 };
  dragStartCrop: Point = { x: 0, y: 0 };
  gestureZoomStart = 0;
  isTouching = false;
  lastPinchDistance = 0;
  rafDragTimeout: number | null = null;
  rafPinchTimeout: number | null = null;
  wheelTimer: number | null = null;
  currentDoc: Document = document;
  currentWindow: Window = window;

  state: State = {
    hasWheelJustStarted: false
  };

  componentDidMount() {
    if (this.containerRef) {
      if (this.containerRef.ownerDocument) {
        this.currentDoc = this.containerRef.ownerDocument;
      }
      if (this.currentDoc.defaultView) {
        this.currentWindow = this.currentDoc.defaultView;
      }
      this.currentWindow.addEventListener('resize', this.computeSizes);
      this.containerRef.addEventListener('wheel', this.onWheel, { passive: false });
      this.containerRef.addEventListener('gesturestart', this.onGestureStart as EventListener);
    }

    // when rendered via SSR, the image can already be loaded and its onLoad callback will never be called
    if (this.imageRef.current && this.imageRef.current.complete) {
      this.onMediaLoad();
    }
  }

  componentWillUnmount() {
    this.currentWindow.removeEventListener('resize', this.computeSizes);
    if (this.containerRef) {
      this.containerRef.removeEventListener('gesturestart', this.preventZoomSafari);
    }

    if (this.styleRef) {
      this.styleRef.parentNode?.removeChild(this.styleRef);
    }

    this.cleanEvents();
    this.clearScrollEvent();
  }

  componentDidUpdate(prevProps: CropperProps) {
    if (prevProps.zoom !== this.props.zoom) {
      this.recomputeCropPosition();
    }
  }

  // prevent Safari on iOS >= 10 to zoom the page
  preventZoomSafari = (e: Event) => e.preventDefault();

  cleanEvents = () => {
    this.currentDoc.removeEventListener('mousemove', this.onMouseMove);
    this.currentDoc.removeEventListener('mouseup', this.onDragStopped);
    this.currentDoc.removeEventListener('touchmove', this.onTouchMove);
    this.currentDoc.removeEventListener('touchend', this.onDragStopped);
    this.currentDoc.removeEventListener('gesturemove', this.onGestureMove as EventListener);
    this.currentDoc.removeEventListener('gestureend', this.onGestureEnd as EventListener);
  };

  clearScrollEvent = () => {
    if (this.containerRef) {
      this.containerRef.removeEventListener('wheel', this.onWheel);
    }
    if (this.wheelTimer) {
      clearTimeout(this.wheelTimer);
    }
  };

  onMediaLoad = () => {
    const cropSize = this.computeSizes();
    this.setNewZoom(1, { x: 0, y: 0 });

    if (cropSize) {
      this.emitCropData();
      this.setInitialCrop();
    }
  };

  setInitialCrop = () => {
    this.props.onCropChange({ x: 0, y: 0 });
  };

  computeSizes = () => {
    const mediaRef = this.imageRef.current;
    if (mediaRef && this.containerRef) {
      const naturalWidth = this.imageRef.current?.naturalWidth || 0;
      const naturalHeight = this.imageRef.current?.naturalHeight || 0;
      const mediaAspect = naturalWidth / naturalHeight;

      let renderedMediaSize: Size =
        naturalWidth < naturalHeight
          ? {
              width: this.props.cropSize.width,
              height: this.props.cropSize.width / mediaAspect
            }
          : {
              width: this.props.cropSize.height * mediaAspect,
              height: this.props.cropSize.height
            };

      this.mediaSize = {
        ...renderedMediaSize,
        naturalWidth,
        naturalHeight
      };

      const cropSize = { width: this.props.cropSize.width, height: this.props.cropSize.height };
      this.recomputeCropPosition();
      return cropSize;
    }
  };

  static getMousePoint = (e: MouseEvent | React.MouseEvent | GestureEvent) => ({
    x: Number(e.clientX),
    y: Number(e.clientY)
  });

  static getTouchPoint = (touch: Touch | React.Touch) => ({
    x: Number(touch.clientX),
    y: Number(touch.clientY)
  });

  onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    this.currentDoc.addEventListener('mousemove', this.onMouseMove);
    this.currentDoc.addEventListener('mouseup', this.onDragStopped);
    this.onDragStart(ImageCropper.getMousePoint(e));
  };

  onMouseMove = (e: MouseEvent) => this.onDrag(ImageCropper.getMousePoint(e));

  onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    this.isTouching = true;
    this.currentDoc.addEventListener('touchmove', this.onTouchMove, { passive: false }); // iOS 11 now defaults to passive: true
    this.currentDoc.addEventListener('touchend', this.onDragStopped);

    if (e.touches.length === 2) {
      this.onPinchStart(e);
    } else if (e.touches.length === 1) {
      this.onDragStart(ImageCropper.getTouchPoint(e.touches[0]));
    }
  };

  onTouchMove = (e: TouchEvent) => {
    // Prevent whole page from scrolling on iOS.
    e.preventDefault();
    if (e.touches.length === 2) {
      this.onPinchMove(e);
    } else if (e.touches.length === 1) {
      this.onDrag(ImageCropper.getTouchPoint(e.touches[0]));
    }
  };

  onGestureStart = (e: GestureEvent) => {
    e.preventDefault();
    this.currentDoc.addEventListener('gesturechange', this.onGestureMove as EventListener);
    this.currentDoc.addEventListener('gestureend', this.onGestureEnd as EventListener);
    this.gestureZoomStart = this.props.zoom;
  };

  onGestureMove = (e: GestureEvent) => {
    e.preventDefault();
    if (this.isTouching) {
      // avoid conflict between gesture and touch events
      return;
    }

    const point = ImageCropper.getMousePoint(e);
    const newZoom = this.gestureZoomStart - 1 + e.scale;
    this.setNewZoom(newZoom, point, { shouldUpdatePosition: true });
  };

  onGestureEnd = () => {
    this.cleanEvents();
  };

  onDragStart = ({ x, y }: Point) => {
    this.dragStartPosition = { x, y };
    this.dragStartCrop = { ...this.props.cropPosition };
  };

  onDrag = ({ x, y }: Point) => {
    if (this.rafDragTimeout) {
      this.currentWindow.cancelAnimationFrame(this.rafDragTimeout);
    }

    this.rafDragTimeout = this.currentWindow.requestAnimationFrame(() => {
      if (x === undefined || y === undefined) {
        return;
      }
      const offsetX = x - this.dragStartPosition.x;
      const offsetY = y - this.dragStartPosition.y;
      const requestedPosition = {
        x: this.dragStartCrop.x + offsetX,
        y: this.dragStartCrop.y + offsetY
      };

      const newPosition = restrictPosition(
        requestedPosition,
        this.mediaSize,
        this.props.cropSize,
        this.props.zoom
      );
      this.props.onCropChange(newPosition);
    });
  };

  onDragStopped = () => {
    this.isTouching = false;
    this.cleanEvents();
    this.emitCropData();
  };

  onPinchStart(e: React.TouchEvent<HTMLDivElement>) {
    const pointA = ImageCropper.getTouchPoint(e.touches[0]);
    const pointB = ImageCropper.getTouchPoint(e.touches[1]);
    this.lastPinchDistance = getDistanceBetweenPoints(pointA, pointB);
    this.onDragStart(getMidpoint(pointA, pointB));
  }

  onPinchMove(e: TouchEvent) {
    const pointA = ImageCropper.getTouchPoint(e.touches[0]);
    const pointB = ImageCropper.getTouchPoint(e.touches[1]);
    const center = getMidpoint(pointA, pointB);
    this.onDrag(center);

    if (this.rafPinchTimeout) {
      this.currentWindow.cancelAnimationFrame(this.rafPinchTimeout);
    }
    this.rafPinchTimeout = this.currentWindow.requestAnimationFrame(() => {
      const distance = getDistanceBetweenPoints(pointA, pointB);
      const newZoom = this.props.zoom * (distance / this.lastPinchDistance);
      this.setNewZoom(newZoom, center, { shouldUpdatePosition: false });
      this.lastPinchDistance = distance;
    });
  }

  onWheel = (e: WheelEvent) => {
    e.preventDefault();
    const point = ImageCropper.getMousePoint(e);
    const { spinY } = normalizeWheel(e);
    const newZoom = this.props.zoom * this.props.zoomSpeed ** -spinY;
    this.setNewZoom(newZoom, point, { shouldUpdatePosition: true });

    if (!this.state.hasWheelJustStarted) {
      this.setState({ hasWheelJustStarted: true }, () => {});
    }

    if (this.wheelTimer) {
      clearTimeout(this.wheelTimer);
    }
    this.wheelTimer = this.currentWindow.setTimeout(
      () => this.setState({ hasWheelJustStarted: false }, () => {}),
      250
    );
  };

  getPointOnContainer = ({ x, y }: Point) => {
    const containerRect = this.containerRef?.getBoundingClientRect();
    if (!containerRect) {
      throw new Error('The Cropper is not mounted');
    }
    return {
      x: containerRect.width / 2 - (x - containerRect.left),
      y: containerRect.height / 2 - (y - containerRect.top)
    };
  };

  getPointOnMedia = ({ x, y }: Point) => {
    const { cropPosition, zoom } = this.props;
    return {
      x: (x + cropPosition.x) / zoom,
      y: (y + cropPosition.y) / zoom
    };
  };

  setNewZoom = (zoom: number, point: Point | null, { shouldUpdatePosition = true } = {}) => {
    if (!this.props.onZoomChange) {
      return;
    }
    const fitWidth =
      this.mediaSize.width / this.mediaSize.height < this.props.cropSize.width / this.props.cropSize.height;
    const zoomScale = fitWidth
      ? this.props.cropSize.width / this.mediaSize.width
      : this.props.cropSize.height / this.mediaSize.height;
    const maxEffectiveZoom = 3;
    const minZoom = 1 * zoomScale;

    // allow different zoom level depending on image resolution
    const pixelScale = fitWidth
      ? this.mediaSize.naturalWidth / this.props.cropSize.width
      : this.mediaSize.naturalHeight / this.props.cropSize.height;
    const maxZoom = Math.max(1, pixelScale * maxEffectiveZoom) * zoomScale;

    const newZoom = restrictValue(zoom, minZoom, maxZoom);

    if (shouldUpdatePosition) {
      const zoomPoint = point ? this.getPointOnContainer(point) : { x: 0, y: 0 };
      const zoomTarget = this.getPointOnMedia(zoomPoint);
      const requestedPosition = {
        x: zoomTarget.x * newZoom - zoomPoint.x,
        y: zoomTarget.y * newZoom - zoomPoint.y
      };

      const newPosition = restrictPosition(requestedPosition, this.mediaSize, this.props.cropSize, newZoom);

      this.props.onCropChange(newPosition);
    }
    this.props.onZoomChange(newZoom, maxZoom);
  };

  getCropData = () => {
    // ensure the crop is correctly restricted after a zoom back (https://github.com/ValentinH/react-easy-crop/issues/6)
    const restrictedPosition = restrictPosition(
      this.props.cropPosition,
      this.mediaSize,
      this.props.cropSize,
      this.props.zoom
    );
    return computeCroppedArea(restrictedPosition, this.props.cropSize, this.mediaSize, this.props.zoom);
  };

  emitCropData = () => {
    const cropData = this.getCropData();
    if (!cropData) {
      return;
    }

    const { croppedAreaPixels } = cropData;
    if (this.props.onCropComplete) {
      this.props.onCropComplete(croppedAreaPixels);
    }
  };

  recomputeCropPosition = () => {
    const newPosition = restrictPosition(
      this.props.cropPosition,
      this.mediaSize,
      this.props.cropSize,
      this.props.zoom
    );
    this.props.onCropChange(newPosition);
    this.emitCropData();
  };

  render() {
    const {
      image,
      cropSize: size,
      borderSize,
      cropPosition: { x, y },
      zoom
    } = this.props;

    return (
      <div
        className="rounded-lg"
        style={{
          overflow: 'hidden',
          width: size.width + borderSize * 2,
          height: size.height + borderSize * 2,
          padding: borderSize
        }}
      >
        <div className="relative" style={{ width: size.width, height: size.height }}>
          <div
            onMouseDown={this.onMouseDown}
            onTouchStart={this.onTouchStart}
            ref={(el) => (this.containerRef = el)}
            data-testid="container"
            className={clsx('reactEasyCrop_Container')}
          >
            {image && (
              <img
                alt=""
                className={clsx(
                  'reactEasyCrop_Image',
                  this.mediaSize.naturalWidth < this.mediaSize.naturalHeight
                    ? 'reactEasyCrop_Cover_Horizontal'
                    : 'reactEasyCrop_Cover_Vertical'
                )}
                src={image}
                ref={this.imageRef}
                style={{ transform: `translate(${x}px, ${y}px) scale(${zoom})` }}
                onLoad={this.onMediaLoad}
              />
            )}
            <div
              style={{
                color: '#bbba',
                boxShadow: `0 0 0 ${borderSize}px`,
                width: size.width,
                height: size.height
              }}
              data-testid="cropper"
              className={clsx('border-brand-500 border-2', 'reactEasyCrop_CropArea')}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ImageCropper;
