import { Errors, IS_MAINNET, SNAPSHOR_RELAY_WORKER_URL } from '@lenster/data';
import axios from 'axios';

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
  } catch (error) {
    console.error('Failed to get proposal from snapshot relay worker', error);
    return { success: false, error: Errors.SomethingWentWrong };
  }
};

export default getSnapshotProposal;
