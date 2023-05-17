import snapshot from '@snapshot-labs/snapshot.js';
import { SNAPSHOT_HUB_URL } from 'data';

export const snapshotClient = new snapshot.Client712(SNAPSHOT_HUB_URL);
