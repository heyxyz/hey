import { Errors } from "@hey/data/errors";
import axios from "axios";
import toast from "react-hot-toast";

/**
 * Uploads the given data to hey-metadata S3 bucket.
 *
 * @param data The data to upload.
 * @returns The S3 transaction ID.
 * @throws An error if the upload fails.
 */
const uploadMetadata = async (data: any): Promise<string> => {
  try {
    const response = await axios.post(
      "https://storage-api.testnet.lens.dev",
      data
    );

    const { uri } = response.data[0];

    return uri;
  } catch {
    toast.error(Errors.SomethingWentWrong);
    throw new Error(Errors.SomethingWentWrong);
  }
};

export default uploadMetadata;
