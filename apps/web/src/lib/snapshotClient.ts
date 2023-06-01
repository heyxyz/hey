import { SNAPSHOT_HUB_URL } from '@lenster/data';
import snapshot from '@snapshot-labs/snapshot.js';

export const snapshotClient = new snapshot.Client712(SNAPSHOT_HUB_URL);
