"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCroppedImg = exports.createImage = exports.getMidpoint = exports.computeCroppedArea = exports.getDistanceBetweenPoints = exports.restrictPosition = exports.restrictValue = void 0;
var restrictValue = function (value, min, max) {
    return Math.min(Math.max(value, min), max);
};
exports.restrictValue = restrictValue;
var restrictPositionCoord = function (position, mediaSize, cropSize, zoom) {
    var maxPosition = (mediaSize * zoom) / 2 - cropSize / 2;
    return (0, exports.restrictValue)(position, -maxPosition, maxPosition);
};
var restrictPosition = function (position, mediaSize, cropSize, zoom) {
    return {
        x: restrictPositionCoord(position.x, mediaSize.width, cropSize.width, zoom),
        y: restrictPositionCoord(position.y, mediaSize.height, cropSize.height, zoom)
    };
};
exports.restrictPosition = restrictPosition;
var getDistanceBetweenPoints = function (pointA, pointB) {
    return Math.sqrt(Math.pow(pointA.y - pointB.y, 2) + Math.pow(pointA.x - pointB.x, 2));
};
exports.getDistanceBetweenPoints = getDistanceBetweenPoints;
var computeCroppedArea = function (cropPosition, cropSize, mediaSize, zoom) {
    var mediaScale = mediaSize.naturalWidth / mediaSize.width;
    var fitWidth = mediaSize.width / mediaSize.height < cropSize.width / cropSize.height;
    var cropSizePixels = fitWidth
        ? {
            width: mediaSize.naturalWidth / zoom,
            height: (mediaSize.naturalWidth * (cropSize.height / cropSize.width)) / zoom
        }
        : {
            width: (mediaSize.naturalHeight * (cropSize.width / cropSize.height)) / zoom,
            height: mediaSize.naturalHeight / zoom
        };
    var cropAreaCenterPixelX = (-cropPosition.x * mediaScale) / zoom;
    var cropAreaCenterPixelY = (-cropPosition.y * mediaScale) / zoom;
    var croppedAreaPixels = __assign(__assign({}, cropSizePixels), { x: cropAreaCenterPixelX -
            cropSizePixels.width / 2 +
            mediaSize.naturalWidth / 2, y: cropAreaCenterPixelY -
            cropSizePixels.height / 2 +
            mediaSize.naturalHeight / 2 });
    return { croppedAreaPixels: croppedAreaPixels };
};
exports.computeCroppedArea = computeCroppedArea;
var getMidpoint = function (a, b) {
    return {
        x: (b.x + a.x) / 2,
        y: (b.y + a.y) / 2
    };
};
exports.getMidpoint = getMidpoint;
var createImage = function (url) {
    return new Promise(function (resolve, reject) {
        var image = new Image();
        image.addEventListener('load', function () { return resolve(image); });
        image.addEventListener('error', function (error) { return reject(error); });
        image.src = url;
    });
};
exports.createImage = createImage;
var getCroppedImg = function (imageSrc, pixelCrop) { return __awaiter(void 0, void 0, void 0, function () {
    var image, canvas, ctx, data;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, exports.createImage)(imageSrc)];
            case 1:
                image = _a.sent();
                canvas = document.createElement('canvas');
                ctx = canvas.getContext('2d');
                if (!ctx || !pixelCrop) {
                    return [2 /*return*/, null];
                }
                canvas.width = image.width;
                canvas.height = image.height;
                ctx.drawImage(image, 0, 0);
                data = ctx.getImageData(pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height);
                canvas.width = pixelCrop.width;
                canvas.height = pixelCrop.height;
                ctx.putImageData(data, 0, 0);
                return [2 /*return*/, canvas];
        }
    });
}); };
exports.getCroppedImg = getCroppedImg;
