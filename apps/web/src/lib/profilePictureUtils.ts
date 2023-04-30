import { uploadFileToIPFS } from './uploadToIPFS';

export function readFile(file: Blob): Promise<string> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener(
      'load',
      () => resolve(reader.result as string),
      false
    );
    reader.readAsDataURL(file);
  });
}

const uploadCroppedImage = async (
  image: HTMLCanvasElement
): Promise<string> => {
  const blob = await new Promise((resolve) => image.toBlob(resolve));
  const file = new File([blob as Blob], 'cropped_image.png', {
    type: (blob as Blob).type
  });
  const attachment = await uploadFileToIPFS(file);
  const ipfsUrl = attachment.original.url;
  if (!ipfsUrl) {
    throw new Error('uploadToIPFS failed');
  }

  return ipfsUrl;
};

export default uploadCroppedImage;
