import axios from 'axios';
import { Errors, IS_MAINNET, SNAPSHOR_RELAY_WORKER_URL } from 'data';

/**
 * Get the poll from the snapshot relay worker.
 * @param proposalId The proposal id.
 * @param voter The voter address.
 * @returns The poll.
 */
const getSnapshotProposal = async (proposalId: string, voter: string) => {
  try {
    const response = await axios(
      `${SNAPSHOR_RELAY_WORKER_URL}/getProposal/${
        IS_MAINNET ? 'mainnet' : 'testnet'
      }/${proposalId}/${voter}`
    );

    return response.data;
  } catch {
    return { success: false, error: Errors.SomethingWentWrong };
  }
};

export default getSnapshotProposal;
