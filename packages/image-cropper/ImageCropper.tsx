import type { RefObject } from "react";

import cn from "@hey/ui/cn";
import normalizeWheel from "normalize-wheel";
import { Component, createRef } from "react";

import type { Area, MediaSize, Point, Size } from "./types";

import {
  computeCroppedArea,
  getDistanceBetweenPoints,
  getMidpoint,
  restrictPosition,
  restrictValue
} from "./cropUtils";

interface CropperProps {
  borderSize: number;
  cropPositionPercent: Point;
  cropSize: Size;
  image?: string;
  onCropChange: (location: Point) => void;
  onCropComplete?: (croppedAreaPixels: Area) => void;
  onZoomChange?: (zoom: number, maxZoom: number) => void;
  targetSize: Size;
  zoom: number;
  zoomSpeed: number;
}

type State = {
  hasWheelJustStarted: boolean;
};

type GestureEvent = {
  clientX: number;
  clientY: number;
  scale: number;
} & UIEvent;

class ImageCropper extends Component<CropperProps, State> {
  static defaultProps = {
    zoom: 1,
    zoomSpeed: 1
  };

  static getMousePoint = (e: GestureEvent | MouseEvent | React.MouseEvent) => ({
    x: Number(e.clientX),
    y: Number(e.clientY)
  });
  static getTouchPoint = (touch: React.Touch | Touch) => ({
    x: Number(touch.clientX),
    y: Number(touch.clientY)
  });
  cleanEvents = () => {
    this.currentDoc.removeEventListener("mousemove", this.onMouseMove);
    this.currentDoc.removeEventListener("mouseup", this.onDragStopped);
    this.currentDoc.removeEventListener("touchmove", this.onTouchMove);
    this.currentDoc.removeEventListener("touchend", this.onDragStopped);
    this.currentDoc.removeEventListener(
      "gesturemove",
      this.onGestureMove as EventListener
    );
    this.currentDoc.removeEventListener(
      "gestureend",
      this.onGestureEnd as EventListener
    );
  };
  clearScrollEvent = () => {
    if (this.containerRef) {
      this.containerRef.removeEventListener("wheel", this.onWheel);
    }
    if (this.wheelTimer) {
      clearTimeout(this.wheelTimer);
    }
  };
  computeSizes = () => {
    const mediaRef = this.imageRef.current;
    if (mediaRef && this.containerRef) {
      const naturalWidth = this.imageRef.current?.naturalWidth || 0;
      const naturalHeight = this.imageRef.current?.naturalHeight || 0;
      const mediaAspect = naturalWidth / naturalHeight;
      const fitWidth =
        naturalWidth / naturalHeight <
        this.props.cropSize.width / this.props.cropSize.height;
      const renderedMediaSize: Size = fitWidth
        ? {
            height: this.props.cropSize.width / mediaAspect,
            width: this.props.cropSize.width
          }
        : {
            height: this.props.cropSize.height,
            width: this.props.cropSize.height * mediaAspect
          };

      this.mediaSize = {
        ...renderedMediaSize,
        naturalHeight,
        naturalWidth
      };
      const cropSize = {
        height: this.props.cropSize.height,
        width: this.props.cropSize.width
      };
      this.recomputeCropPosition();
      return cropSize;
    }
  };
  containerRef: HTMLDivElement | null = null;
  currentDoc: Document = document;
  currentWindow: Window = window;
  dragStartCrop: Point = { x: 0, y: 0 };
  dragStartPosition: Point = { x: 0, y: 0 };
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
  gestureZoomStart = 0;
  getAbsolutePosition = (percentPosition: Point): Point => {
    const x = (this.mediaSize.width * percentPosition.x) / 100;
    const y = (this.mediaSize.height * percentPosition.y) / 100;
    return { x, y };
  };

  getCropData = () => {
    // ensure the crop is correctly restricted after a zoom back (https://github.com/ValentinH/react-easy-crop/issues/6)
    const cropPosition = this.getAbsolutePosition(
      this.props.cropPositionPercent
    );
    const restrictedPosition = restrictPosition(
      cropPosition,
      this.mediaSize,
      this.props.cropSize,
      this.props.zoom
    );
    return computeCroppedArea(
      restrictedPosition,
      this.props.cropSize,
      this.mediaSize,
      this.props.zoom
    );
  };

  getPercentPosition = (absolutePosition: Point): Point => {
    const x = (absolutePosition.x / this.mediaSize.width) * 100;
    const y = (absolutePosition.y / this.mediaSize.height) * 100;
    return { x, y };
  };

  getPointOnContainer = ({ x, y }: Point) => {
    const containerRect = this.containerRef?.getBoundingClientRect();
    if (!containerRect) {
      throw new Error("The Cropper is not mounted");
    }
    return {
      x: containerRect.width / 2 - (x - containerRect.left),
      y: containerRect.height / 2 - (y - containerRect.top)
    };
  };

  getPointOnMedia = ({ x, y }: Point) => {
    const cropPosition = this.getAbsolutePosition(
      this.props.cropPositionPercent
    );
    const { zoom } = this.props;
    return {
      x: (x + cropPosition.x) / zoom,
      y: (y + cropPosition.y) / zoom
    };
  };

  imageRef: RefObject<HTMLImageElement> = createRef();

  isTouching = false;

  lastPinchDistance = 0;

  mediaSize: MediaSize = {
    height: 0,
    naturalHeight: 0,
    naturalWidth: 0,
    width: 0
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
      const newPercentPosition = this.getPercentPosition(newPosition);
      this.props.onCropChange(newPercentPosition);
    });
  };

  onDragStart = ({ x, y }: Point) => {
    this.dragStartPosition = { x, y };
    this.dragStartCrop = {
      ...this.getAbsolutePosition(this.props.cropPositionPercent)
    };
  };

  onDragStopped = () => {
    this.isTouching = false;
    this.cleanEvents();
    this.emitCropData();
  };

  onGestureEnd = () => {
    this.cleanEvents();
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

  onGestureStart = (e: GestureEvent) => {
    e.preventDefault();
    this.currentDoc.addEventListener(
      "gesturechange",
      this.onGestureMove as EventListener
    );
    this.currentDoc.addEventListener(
      "gestureend",
      this.onGestureEnd as EventListener
    );
    this.gestureZoomStart = this.props.zoom;
  };

  onMediaLoad = () => {
    const cropSize = this.computeSizes();
    this.setNewZoom(1, { x: 0, y: 0 });

    if (cropSize) {
      this.emitCropData();
      this.setInitialCrop();
    }
  };

  onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();
    this.currentDoc.addEventListener("mousemove", this.onMouseMove);
    this.currentDoc.addEventListener("mouseup", this.onDragStopped);
    this.onDragStart(ImageCropper.getMousePoint(e));
  };

  onMouseMove = (e: MouseEvent) => this.onDrag(ImageCropper.getMousePoint(e));

  onTouchMove = (e: TouchEvent) => {
    // Prevent whole page from scrolling on iOS.
    e.preventDefault();
    if (e.touches.length === 2) {
      this.onPinchMove(e);
    } else if (e.touches.length === 1) {
      this.onDrag(ImageCropper.getTouchPoint(e.touches[0]));
    }
  };

  onTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    this.isTouching = true;
    this.currentDoc.addEventListener("touchmove", this.onTouchMove, {
      passive: false
    }); // iOS 11 now defaults to passive: true
    this.currentDoc.addEventListener("touchend", this.onDragStopped);

    if (e.touches.length === 2) {
      this.onPinchStart(e);
    } else if (e.touches.length === 1) {
      this.onDragStart(ImageCropper.getTouchPoint(e.touches[0]));
    }
  };

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

  // prevent Safari on iOS >= 10 to zoom the page
  preventZoomSafari = (e: Event) => e.preventDefault();

  rafDragTimeout: null | number = null;

  rafPinchTimeout: null | number = null;

  recomputeCropPosition = () => {
    const cropPosition = this.getAbsolutePosition(
      this.props.cropPositionPercent
    );
    const newPosition = restrictPosition(
      cropPosition,
      this.mediaSize,
      this.props.cropSize,
      this.props.zoom
    );
    const newPercentagePosition = this.getPercentPosition(newPosition);
    this.props.onCropChange(newPercentagePosition);
    this.emitCropData();
  };

  setInitialCrop = () => {
    this.props.onCropChange({ x: 0, y: 0 });
  };

  setNewZoom = (
    zoom: number,
    point: null | Point,
    { shouldUpdatePosition = true } = {}
  ) => {
    if (!this.props.onZoomChange) {
      return;
    }
    const fitWidth =
      this.mediaSize.width / this.mediaSize.height <
      this.props.cropSize.width / this.props.cropSize.height;
    const mediaToTargetSizeRatio = fitWidth
      ? this.mediaSize.naturalWidth / this.props.targetSize.width
      : this.mediaSize.naturalHeight / this.props.targetSize.height;
    const maxOutputBlurryness = 2;
    const minZoom = 1;
    const maxZoom = Math.max(
      minZoom,
      mediaToTargetSizeRatio * maxOutputBlurryness
    );
    const newZoom = restrictValue(zoom, minZoom, maxZoom);

    if (shouldUpdatePosition) {
      const zoomPoint = point
        ? this.getPointOnContainer(point)
        : { x: 0, y: 0 };
      const zoomTarget = this.getPointOnMedia(zoomPoint);
      const requestedPosition = {
        x: zoomTarget.x * newZoom - zoomPoint.x,
        y: zoomTarget.y * newZoom - zoomPoint.y
      };

      const newPosition = restrictPosition(
        requestedPosition,
        this.mediaSize,
        this.props.cropSize,
        newZoom
      );
      const newPercentagePosition = this.getPercentPosition(newPosition);
      this.props.onCropChange(newPercentagePosition);
    }
    this.props.onZoomChange(newZoom, maxZoom);
  };

  state: State = {
    hasWheelJustStarted: false
  };

  wheelTimer: null | number = null;

  componentDidMount() {
    if (this.containerRef) {
      if (this.containerRef.ownerDocument) {
        this.currentDoc = this.containerRef.ownerDocument;
      }
      if (this.currentDoc.defaultView) {
        this.currentWindow = this.currentDoc.defaultView;
      }
      this.containerRef.addEventListener("wheel", this.onWheel, {
        passive: false
      });
      this.containerRef.addEventListener(
        "gesturestart",
        this.onGestureStart as EventListener
      );
    }

    // when rendered via SSR, the image can already be loaded and its onLoad callback will never be called
    if (this.imageRef.current?.complete) {
      this.onMediaLoad();
    }
  }

  componentDidUpdate(prevProps: CropperProps) {
    if (prevProps.zoom !== this.props.zoom) {
      this.recomputeCropPosition();
    }
    if (
      this.props.cropSize.width !== prevProps.cropSize.width ||
      this.props.cropSize.height !== prevProps.cropSize.height
    ) {
      this.computeSizes();
    }
  }

  componentWillUnmount() {
    if (this.containerRef) {
      this.containerRef.removeEventListener(
        "gesturestart",
        this.preventZoomSafari
      );
    }
    this.cleanEvents();
    this.clearScrollEvent();
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

  onPinchStart(e: React.TouchEvent<HTMLDivElement>) {
    const pointA = ImageCropper.getTouchPoint(e.touches[0]);
    const pointB = ImageCropper.getTouchPoint(e.touches[1]);
    this.lastPinchDistance = getDistanceBetweenPoints(pointA, pointB);
    this.onDragStart(getMidpoint(pointA, pointB));
  }

  render() {
    const {
      borderSize,
      cropPositionPercent: { x, y },
      cropSize: size,
      image,
      zoom
    } = this.props;
    const fitWidth =
      this.mediaSize.naturalWidth / this.mediaSize.naturalHeight <
      this.props.cropSize.width / this.props.cropSize.height;

    return (
      <div
        className="rounded-lg"
        style={{
          height: size.height + borderSize * 2,
          overflow: "hidden",
          padding: borderSize,
          width: size.width + borderSize * 2
        }}
      >
        <div
          className="relative"
          style={{ height: size.height, width: size.width }}
        >
          <div
            className={cn("reactEasyCrop_Container")}
            onMouseDown={this.onMouseDown}
            onTouchStart={this.onTouchStart}
            ref={(el) => (this.containerRef = el) as any}
          >
            {image && (
              <img
                alt=""
                className={cn(
                  "reactEasyCrop_Image",
                  fitWidth
                    ? "reactEasyCrop_Cover_Horizontal"
                    : "reactEasyCrop_Cover_Vertical"
                )}
                onLoad={this.onMediaLoad}
                ref={this.imageRef}
                src={image}
                style={{ transform: `translate(${x}%, ${y}%) scale(${zoom})` }}
              />
            )}
            <div
              className={cn(
                "border-2 border-gray-500",
                "reactEasyCrop_CropArea"
              )}
              style={{
                boxShadow: `0 0 0 ${borderSize}px`,
                color: "#bbba",
                height: size.height,
                width: size.width
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default ImageCropper;
