import imageCompression from "browser-image-compression";
import { uploadFileToStorageNode } from "./uploadToStorageNode";

/**
 * Read a file as a base64 string
 * @param file File
 * @returns Base64 string
 */
export const readFile = (file: Blob): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      "load",
      () => resolve(reader.result as string),
      false
    );
    reader.readAsDataURL(file);
  });
};

/**
 * Upload cropped image to storage node
 * @param image Image
 * @returns storage node URL
 */
const uploadCroppedImage = async (
  image: HTMLCanvasElement
): Promise<string> => {
  const blob = await new Promise((resolve) => image.toBlob(resolve));
  const file = new File([blob as Blob], "cropped_image.png", {
    type: (blob as Blob).type
  });
  const cleanedFile = await imageCompression(file, {
    exifOrientation: 1,
    maxSizeMB: 3,
    maxWidthOrHeight: 2000,
    useWebWorker: true
  });
  const attachment = await uploadFileToStorageNode(cleanedFile);
  const decentralizedUrl = attachment.uri;
  if (!decentralizedUrl) {
    throw new Error("uploadFileToStorageNode failed");
  }

  return decentralizedUrl;
};

export default uploadCroppedImage;
