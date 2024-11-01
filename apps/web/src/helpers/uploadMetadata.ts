import { HEY_API_URL } from "@hey/data/constants";
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
    const response = await axios.post(`${HEY_API_URL}/metadata`, {
      ...data
    });
    const { id }: { id: string } = response.data;

    return id;
  } catch {
    toast.error(Errors.SomethingWentWrong);
    throw new Error(Errors.SomethingWentWrong);
  }
};

export default uploadMetadata;
