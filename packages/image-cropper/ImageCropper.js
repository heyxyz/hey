'use strict';
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b)
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== 'function' && b !== null)
        throw new TypeError(
          'Class extends value ' + String(b) + ' is not a constructor or null'
        );
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype =
        b === null
          ? Object.create(b)
          : ((__.prototype = b.prototype), new __());
    };
  })();
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, '__esModule', { value: true });
var clsx_1 = require('clsx');
var normalize_wheel_1 = require('normalize-wheel');
var react_1 = require('react');
var cropUtils_1 = require('./cropUtils');
var ImageCropper = /** @class */ (function (_super) {
  __extends(ImageCropper, _super);
  function ImageCropper() {
    var _this = (_super !== null && _super.apply(this, arguments)) || this;
    _this.imageRef = (0, react_1.createRef)();
    _this.containerRef = null;
    _this.mediaSize = {
      width: 0,
      height: 0,
      naturalWidth: 0,
      naturalHeight: 0
    };
    _this.dragStartPosition = { x: 0, y: 0 };
    _this.dragStartCrop = { x: 0, y: 0 };
    _this.gestureZoomStart = 0;
    _this.isTouching = false;
    _this.lastPinchDistance = 0;
    _this.rafDragTimeout = null;
    _this.rafPinchTimeout = null;
    _this.wheelTimer = null;
    _this.currentDoc = document;
    _this.currentWindow = window;
    _this.state = {
      hasWheelJustStarted: false
    };
    // prevent Safari on iOS >= 10 to zoom the page
    _this.preventZoomSafari = function (e) {
      return e.preventDefault();
    };
    _this.cleanEvents = function () {
      _this.currentDoc.removeEventListener('mousemove', _this.onMouseMove);
      _this.currentDoc.removeEventListener('mouseup', _this.onDragStopped);
      _this.currentDoc.removeEventListener('touchmove', _this.onTouchMove);
      _this.currentDoc.removeEventListener('touchend', _this.onDragStopped);
      _this.currentDoc.removeEventListener('gesturemove', _this.onGestureMove);
      _this.currentDoc.removeEventListener('gestureend', _this.onGestureEnd);
    };
    _this.clearScrollEvent = function () {
      if (_this.containerRef) {
        _this.containerRef.removeEventListener('wheel', _this.onWheel);
      }
      if (_this.wheelTimer) {
        clearTimeout(_this.wheelTimer);
      }
    };
    _this.onMediaLoad = function () {
      var cropSize = _this.computeSizes();
      _this.setNewZoom(1, { x: 0, y: 0 });
      if (cropSize) {
        _this.emitCropData();
        _this.setInitialCrop();
      }
    };
    _this.setInitialCrop = function () {
      _this.props.onCropChange({ x: 0, y: 0 });
    };
    _this.computeSizes = function () {
      var _a, _b;
      var mediaRef = _this.imageRef.current;
      if (mediaRef && _this.containerRef) {
        var naturalWidth =
          ((_a = _this.imageRef.current) === null || _a === void 0
            ? void 0
            : _a.naturalWidth) || 0;
        var naturalHeight =
          ((_b = _this.imageRef.current) === null || _b === void 0
            ? void 0
            : _b.naturalHeight) || 0;
        var mediaAspect = naturalWidth / naturalHeight;
        var fitWidth =
          naturalWidth / naturalHeight <
          _this.props.cropSize.width / _this.props.cropSize.height;
        var renderedMediaSize = fitWidth
          ? {
              width: _this.props.cropSize.width,
              height: _this.props.cropSize.width / mediaAspect
            }
          : {
              width: _this.props.cropSize.height * mediaAspect,
              height: _this.props.cropSize.height
            };
        _this.mediaSize = __assign(__assign({}, renderedMediaSize), {
          naturalWidth: naturalWidth,
          naturalHeight: naturalHeight
        });
        var cropSize = {
          width: _this.props.cropSize.width,
          height: _this.props.cropSize.height
        };
        _this.recomputeCropPosition();
        return cropSize;
      }
    };
    _this.onMouseDown = function (e) {
      e.preventDefault();
      _this.currentDoc.addEventListener('mousemove', _this.onMouseMove);
      _this.currentDoc.addEventListener('mouseup', _this.onDragStopped);
      _this.onDragStart(ImageCropper.getMousePoint(e));
    };
    _this.onMouseMove = function (e) {
      return _this.onDrag(ImageCropper.getMousePoint(e));
    };
    _this.onTouchStart = function (e) {
      _this.isTouching = true;
      _this.currentDoc.addEventListener('touchmove', _this.onTouchMove, {
        passive: false
      }); // iOS 11 now defaults to passive: true
      _this.currentDoc.addEventListener('touchend', _this.onDragStopped);
      if (e.touches.length === 2) {
        _this.onPinchStart(e);
      } else if (e.touches.length === 1) {
        _this.onDragStart(ImageCropper.getTouchPoint(e.touches[0]));
      }
    };
    _this.onTouchMove = function (e) {
      // Prevent whole page from scrolling on iOS.
      e.preventDefault();
      if (e.touches.length === 2) {
        _this.onPinchMove(e);
      } else if (e.touches.length === 1) {
        _this.onDrag(ImageCropper.getTouchPoint(e.touches[0]));
      }
    };
    _this.onGestureStart = function (e) {
      e.preventDefault();
      _this.currentDoc.addEventListener('gesturechange', _this.onGestureMove);
      _this.currentDoc.addEventListener('gestureend', _this.onGestureEnd);
      _this.gestureZoomStart = _this.props.zoom;
    };
    _this.onGestureMove = function (e) {
      e.preventDefault();
      if (_this.isTouching) {
        // avoid conflict between gesture and touch events
        return;
      }
      var point = ImageCropper.getMousePoint(e);
      var newZoom = _this.gestureZoomStart - 1 + e.scale;
      _this.setNewZoom(newZoom, point, { shouldUpdatePosition: true });
    };
    _this.onGestureEnd = function () {
      _this.cleanEvents();
    };
    _this.onDragStart = function (_a) {
      var x = _a.x,
        y = _a.y;
      _this.dragStartPosition = { x: x, y: y };
      _this.dragStartCrop = __assign(
        {},
        _this.getAbsolutePosition(_this.props.cropPositionPercent)
      );
    };
    _this.onDrag = function (_a) {
      var x = _a.x,
        y = _a.y;
      if (_this.rafDragTimeout) {
        _this.currentWindow.cancelAnimationFrame(_this.rafDragTimeout);
      }
      _this.rafDragTimeout = _this.currentWindow.requestAnimationFrame(
        function () {
          if (x === undefined || y === undefined) {
            return;
          }
          var offsetX = x - _this.dragStartPosition.x;
          var offsetY = y - _this.dragStartPosition.y;
          var requestedPosition = {
            x: _this.dragStartCrop.x + offsetX,
            y: _this.dragStartCrop.y + offsetY
          };
          var newPosition = (0, cropUtils_1.restrictPosition)(
            requestedPosition,
            _this.mediaSize,
            _this.props.cropSize,
            _this.props.zoom
          );
          var newPercentPosition = _this.getPercentPosition(newPosition);
          _this.props.onCropChange(newPercentPosition);
        }
      );
    };
    _this.onDragStopped = function () {
      _this.isTouching = false;
      _this.cleanEvents();
      _this.emitCropData();
    };
    _this.onWheel = function (e) {
      e.preventDefault();
      var point = ImageCropper.getMousePoint(e);
      var spinY = (0, normalize_wheel_1.default)(e).spinY;
      var newZoom = _this.props.zoom * Math.pow(_this.props.zoomSpeed, -spinY);
      _this.setNewZoom(newZoom, point, { shouldUpdatePosition: true });
      if (!_this.state.hasWheelJustStarted) {
        _this.setState({ hasWheelJustStarted: true }, function () {});
      }
      if (_this.wheelTimer) {
        clearTimeout(_this.wheelTimer);
      }
      _this.wheelTimer = _this.currentWindow.setTimeout(function () {
        return _this.setState({ hasWheelJustStarted: false }, function () {});
      }, 250);
    };
    _this.getPointOnContainer = function (_a) {
      var _b;
      var x = _a.x,
        y = _a.y;
      var containerRect =
        (_b = _this.containerRef) === null || _b === void 0
          ? void 0
          : _b.getBoundingClientRect();
      if (!containerRect) {
        throw new Error('The Cropper is not mounted');
      }
      return {
        x: containerRect.width / 2 - (x - containerRect.left),
        y: containerRect.height / 2 - (y - containerRect.top)
      };
    };
    _this.getAbsolutePosition = function (percentPosition) {
      var x = (_this.mediaSize.width * percentPosition.x) / 100;
      var y = (_this.mediaSize.height * percentPosition.y) / 100;
      return { x: x, y: y };
    };
    _this.getPercentPosition = function (absolutePosition) {
      var x = (absolutePosition.x / _this.mediaSize.width) * 100;
      var y = (absolutePosition.y / _this.mediaSize.height) * 100;
      return { x: x, y: y };
    };
    _this.getPointOnMedia = function (_a) {
      var x = _a.x,
        y = _a.y;
      var cropPosition = _this.getAbsolutePosition(
        _this.props.cropPositionPercent
      );
      var zoom = _this.props.zoom;
      return {
        x: (x + cropPosition.x) / zoom,
        y: (y + cropPosition.y) / zoom
      };
    };
    _this.setNewZoom = function (zoom, point, _a) {
      var _b = _a === void 0 ? {} : _a,
        _c = _b.shouldUpdatePosition,
        shouldUpdatePosition = _c === void 0 ? true : _c;
      if (!_this.props.onZoomChange) {
        return;
      }
      var fitWidth =
        _this.mediaSize.width / _this.mediaSize.height <
        _this.props.cropSize.width / _this.props.cropSize.height;
      var mediaToTargetSizeRatio = fitWidth
        ? _this.mediaSize.naturalWidth / _this.props.targetSize.width
        : _this.mediaSize.naturalHeight / _this.props.targetSize.height;
      var maxOutputBlurryness = 2;
      var minZoom = 1;
      var maxZoom = Math.max(
        minZoom,
        mediaToTargetSizeRatio * maxOutputBlurryness
      );
      var newZoom = (0, cropUtils_1.restrictValue)(zoom, minZoom, maxZoom);
      if (shouldUpdatePosition) {
        var zoomPoint = point
          ? _this.getPointOnContainer(point)
          : { x: 0, y: 0 };
        var zoomTarget = _this.getPointOnMedia(zoomPoint);
        var requestedPosition = {
          x: zoomTarget.x * newZoom - zoomPoint.x,
          y: zoomTarget.y * newZoom - zoomPoint.y
        };
        var newPosition = (0, cropUtils_1.restrictPosition)(
          requestedPosition,
          _this.mediaSize,
          _this.props.cropSize,
          newZoom
        );
        var newPercentagePosition = _this.getPercentPosition(newPosition);
        _this.props.onCropChange(newPercentagePosition);
      }
      _this.props.onZoomChange(newZoom, maxZoom);
    };
    _this.getCropData = function () {
      // ensure the crop is correctly restricted after a zoom back (https://github.com/ValentinH/react-easy-crop/issues/6)
      var cropPosition = _this.getAbsolutePosition(
        _this.props.cropPositionPercent
      );
      var restrictedPosition = (0, cropUtils_1.restrictPosition)(
        cropPosition,
        _this.mediaSize,
        _this.props.cropSize,
        _this.props.zoom
      );
      return (0, cropUtils_1.computeCroppedArea)(
        restrictedPosition,
        _this.props.cropSize,
        _this.mediaSize,
        _this.props.zoom
      );
    };
    _this.emitCropData = function () {
      var cropData = _this.getCropData();
      if (!cropData) {
        return;
      }
      var croppedAreaPixels = cropData.croppedAreaPixels;
      if (_this.props.onCropComplete) {
        _this.props.onCropComplete(croppedAreaPixels);
      }
    };
    _this.recomputeCropPosition = function () {
      var cropPosition = _this.getAbsolutePosition(
        _this.props.cropPositionPercent
      );
      var newPosition = (0, cropUtils_1.restrictPosition)(
        cropPosition,
        _this.mediaSize,
        _this.props.cropSize,
        _this.props.zoom
      );
      var newPercentagePosition = _this.getPercentPosition(newPosition);
      _this.props.onCropChange(newPercentagePosition);
      _this.emitCropData();
    };
    return _this;
  }
  ImageCropper.prototype.componentDidMount = function () {
    if (this.containerRef) {
      if (this.containerRef.ownerDocument) {
        this.currentDoc = this.containerRef.ownerDocument;
      }
      if (this.currentDoc.defaultView) {
        this.currentWindow = this.currentDoc.defaultView;
      }
      this.containerRef.addEventListener('wheel', this.onWheel, {
        passive: false
      });
      this.containerRef.addEventListener('gesturestart', this.onGestureStart);
    }
    // when rendered via SSR, the image can already be loaded and its onLoad callback will never be called
    if (this.imageRef.current && this.imageRef.current.complete) {
      this.onMediaLoad();
    }
  };
  ImageCropper.prototype.componentWillUnmount = function () {
    if (this.containerRef) {
      this.containerRef.removeEventListener(
        'gesturestart',
        this.preventZoomSafari
      );
    }
    this.cleanEvents();
    this.clearScrollEvent();
  };
  ImageCropper.prototype.componentDidUpdate = function (prevProps) {
    if (prevProps.zoom !== this.props.zoom) {
      this.recomputeCropPosition();
    }
    if (
      this.props.cropSize.width !== prevProps.cropSize.width ||
      this.props.cropSize.height !== prevProps.cropSize.height
    ) {
      this.computeSizes();
    }
  };
  ImageCropper.prototype.onPinchStart = function (e) {
    var pointA = ImageCropper.getTouchPoint(e.touches[0]);
    var pointB = ImageCropper.getTouchPoint(e.touches[1]);
    this.lastPinchDistance = (0, cropUtils_1.getDistanceBetweenPoints)(
      pointA,
      pointB
    );
    this.onDragStart((0, cropUtils_1.getMidpoint)(pointA, pointB));
  };
  ImageCropper.prototype.onPinchMove = function (e) {
    var _this = this;
    var pointA = ImageCropper.getTouchPoint(e.touches[0]);
    var pointB = ImageCropper.getTouchPoint(e.touches[1]);
    var center = (0, cropUtils_1.getMidpoint)(pointA, pointB);
    this.onDrag(center);
    if (this.rafPinchTimeout) {
      this.currentWindow.cancelAnimationFrame(this.rafPinchTimeout);
    }
    this.rafPinchTimeout = this.currentWindow.requestAnimationFrame(
      function () {
        var distance = (0, cropUtils_1.getDistanceBetweenPoints)(
          pointA,
          pointB
        );
        var newZoom = _this.props.zoom * (distance / _this.lastPinchDistance);
        _this.setNewZoom(newZoom, center, { shouldUpdatePosition: false });
        _this.lastPinchDistance = distance;
      }
    );
  };
  ImageCropper.prototype.render = function () {
    var _this = this;
    var _a = this.props,
      image = _a.image,
      size = _a.cropSize,
      borderSize = _a.borderSize,
      _b = _a.cropPositionPercent,
      x = _b.x,
      y = _b.y,
      zoom = _a.zoom;
    var fitWidth =
      this.mediaSize.naturalWidth / this.mediaSize.naturalHeight <
      this.props.cropSize.width / this.props.cropSize.height;
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
        <div
          className="relative"
          style={{ width: size.width, height: size.height }}
        >
          <div
            onMouseDown={this.onMouseDown}
            onTouchStart={this.onTouchStart}
            ref={function (el) {
              return (_this.containerRef = el);
            }}
            data-testid="container"
            className={(0, clsx_1.default)('reactEasyCrop_Container')}
          >
            {image && (
              <img
                alt=""
                className={(0, clsx_1.default)(
                  'reactEasyCrop_Image',
                  fitWidth
                    ? 'reactEasyCrop_Cover_Horizontal'
                    : 'reactEasyCrop_Cover_Vertical'
                )}
                src={image}
                ref={this.imageRef}
                style={{
                  transform: 'translate('
                    .concat(x, '%, ')
                    .concat(y, '%) scale(')
                    .concat(zoom, ')')
                }}
                onLoad={this.onMediaLoad}
              />
            )}
            <div
              style={{
                color: '#bbba',
                boxShadow: '0 0 0 '.concat(borderSize, 'px'),
                width: size.width,
                height: size.height
              }}
              data-testid="cropper"
              className={(0, clsx_1.default)(
                'border-brand-500 border-2',
                'reactEasyCrop_CropArea'
              )}
            />
          </div>
        </div>
      </div>
    );
  };
  ImageCropper.defaultProps = {
    zoom: 1,
    zoomSpeed: 1
  };
  ImageCropper.getMousePoint = function (e) {
    return {
      x: Number(e.clientX),
      y: Number(e.clientY)
    };
  };
  ImageCropper.getTouchPoint = function (touch) {
    return {
      x: Number(touch.clientX),
      y: Number(touch.clientY)
    };
  };
  return ImageCropper;
})(react_1.Component);
exports.default = ImageCropper;
