import type { StorageNodeResponse } from "@hey/types/misc";
import { StorageClient } from "@lens-chain/storage-client";

const storageClient = StorageClient.create();

/**
 * Uploads a set of files to the Lens Storage Node and returns an array of MediaSet objects.
 *
 * @param data Files to upload to Lens Storage Node.
 * @param onProgress Callback to be called when the upload progress changes.
 * @returns Array of MediaSet objects.
 */
const uploadToStorageNode = async (
  data: File[]
): Promise<StorageNodeResponse[]> => {
  try {
    const { files } = await storageClient.uploadFolder(data);
    const attachments = files.map(({ gatewayUrl }, index) => {
      return { mimeType: data[index].type || "image/jpeg", uri: gatewayUrl };
    });

    return attachments;
  } catch {
    return [];
  }
};

/**
 * Uploads a file to the Lens Storage Node and returns a MediaSet object.
 *
 * @param file File to upload to Lens Storage Node.
 * @returns MediaSet object or null if the upload fails.
 */
export const uploadFileToStorageNode = async (
  file: File
): Promise<StorageNodeResponse> => {
  try {
    const response = await uploadToStorageNode([file]);
    const { uri, mimeType } = response[0];

    return { mimeType, uri };
  } catch {
    return { mimeType: "", uri: "" };
  }
};

export default uploadToStorageNode;
