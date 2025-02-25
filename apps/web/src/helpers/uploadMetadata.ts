import { STORAGE_NODE_URL } from "@hey/data/constants";
import { Errors } from "@hey/data/errors";
import axios from "axios";

/**
 * Uploads the given data to hey-metadata S3 bucket.
 *
 * @param data The data to upload.
 * @returns The S3 transaction ID.
 * @throws An error if the upload fails.
 */
const uploadMetadata = async (data: any): Promise<string> => {
  try {
    const response = await axios.post(STORAGE_NODE_URL, data);
    const { uri } = response.data[0];

    return uri;
  } catch {
    throw new Error(Errors.SomethingWentWrong);
  }
};

export default uploadMetadata;
