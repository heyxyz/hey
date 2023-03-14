import { expect, test } from '@playwright/test';
import { IPFS_GATEWAY } from 'data/constants';
import getIPFSLink from 'utils/getIPFSLink';

test('getIPFSLink', async ({ page }) => {
  const cidV0 = getIPFSLink('ipfs://QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR');
  await expect(cidV0).toBe(`${IPFS_GATEWAY}QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`);

  const cidV1 = getIPFSLink('ipfs://bafkreigtnlyilggrkgpyjbgdzlxmcc4go3364n62uiq577smnnsoczfo6e');
  await expect(cidV1).toBe(`${IPFS_GATEWAY}bafkreigtnlyilggrkgpyjbgdzlxmcc4go3364n62uiq577smnnsoczfo6e`);

  const doubleIpfs = getIPFSLink('ipfs://ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR');
  await expect(doubleIpfs).toBe(`${IPFS_GATEWAY}QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`);

  const defaultIpfs = getIPFSLink('https://ipfs.io/ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR');
  await expect(defaultIpfs).toBe(`${IPFS_GATEWAY}QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`);
});
