import type { StorageNodeResponse } from "@hey/types/misc";
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
const uploadToIPFS = async (data: File[]): Promise<StorageNodeResponse[]> => {
	try {
		const { files } = await storageClient.uploadFolder(data);
		const attachments = files.map(({ gatewayUrl }, index) => {
			return { mimeType: data[index].type || FALLBACK_TYPE, uri: gatewayUrl };
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
export const uploadFileToIPFS = async (
	file: File,
): Promise<StorageNodeResponse> => {
	try {
		const response = await uploadToIPFS([file]);
		const { uri, mimeType } = response[0];

		return { mimeType, uri };
	} catch {
		return { mimeType: "", uri: "" };
	}
};

export default uploadToIPFS;
