import { Dimensions, PixelRatio, Platform } from "react-native";

export const { width: windowWidth, height: windowHeight } =
  Dimensions.get("window");

// based on iphone 5s's scale
const scale = windowWidth / 320;

const normalizeFont = (size: number) => {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  }
  return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
};

export default normalizeFont;
