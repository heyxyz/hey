import imageCompression from "browser-image-compression";

import { uploadFileToIPFS } from "./uploadToIPFS";

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
 * Upload cropped image to IPFS
 * @param image Image
 * @returns IPFS URL
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
    maxSizeMB: 2,
    maxWidthOrHeight: 4096,
    useWebWorker: true
  });
  const attachment = await uploadFileToIPFS(cleanedFile);
  const ipfsUrl = attachment.uri;
  if (!ipfsUrl) {
    throw new Error("uploadToIPFS failed");
  }

  return ipfsUrl;
};

export default uploadCroppedImage;
