import axios from 'axios';
import { Errors, IS_MAINNET, SNAPSHOR_RELAY_WORKER_URL } from 'data';

/**
 * Get the space from the snapshot relay worker.
 * @param proposalId The proposal id.
 * @returns The space id.
 */
const getSnapshotSpace = async (proposalId: string) => {
  try {
    const response = await axios(
      `${SNAPSHOR_RELAY_WORKER_URL}/getSpaceId/${
        IS_MAINNET ? 'mainnet' : 'testnet'
      }/${proposalId}`
    );

    return response.data;
  } catch (error) {
    console.error('Failed to get space from snapshot relay worker', error);
    return { success: false, error: Errors.SomethingWentWrong };
  }
};

export default getSnapshotSpace;
