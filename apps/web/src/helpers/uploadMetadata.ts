import { Errors } from "@hey/data/errors";
import { storageClient } from "./storageClient";

/**
 * Uploads the given data to lens storage node.
 *
 * @param data The data to upload.
 * @returns The storage node uri (lens://id).
 * @throws An error if the upload fails.
 */
const uploadMetadata = async (data: any): Promise<string> => {
  try {
    const { uri } = await storageClient.uploadAsJson(data);

    return uri;
  } catch {
    throw new Error(Errors.SomethingWentWrong);
  }
};

export default uploadMetadata;
