import type { IPFSResponse } from "@hey/types/misc";
import { StorageClient, testnet } from "@lens-protocol/storage-node-client";

const storageClient = StorageClient.create(testnet);
const FALLBACK_TYPE = "image/jpeg";

/**
 * Uploads a set of files to the IPFS network via S3 and returns an array of MediaSet objects.
 *
 * @param data Files to upload to IPFS.
 * @param onProgress Callback to be called when the upload progress changes.
 * @returns Array of MediaSet objects.
 */
const uploadToIPFS = async (data: File[]): Promise<IPFSResponse[]> => {
  try {
    const { files } = await storageClient.uploadFolder(data);
    const attachments = files.map(({ uri }, index) => {
      return { mimeType: data[index].type || FALLBACK_TYPE, uri };
    });

    return attachments;
  } catch {
    return [];
  }
};

/**
 * Uploads a file to the IPFS network via S3 and returns a MediaSet object.
 *
 * @param file File to upload to IPFS.
 * @returns MediaSet object or null if the upload fails.
 */
export const uploadFileToIPFS = async (file: File): Promise<IPFSResponse> => {
  try {
    const ipfsResponse = await uploadToIPFS([file]);
    const metadata = ipfsResponse[0];

    return { mimeType: file.type || FALLBACK_TYPE, uri: metadata.uri };
  } catch {
    return { mimeType: file.type || FALLBACK_TYPE, uri: "" };
  }
};

export default uploadToIPFS;
