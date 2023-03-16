import { expect, test } from '@playwright/test';
import { IPFS_GATEWAY } from 'data/constants';
import getIPFSLink from 'utils/getIPFSLink';

test.describe('getIPFSLink', async () => {
  test('should return empty string when input hash is falsy', async () => {
    await expect(getIPFSLink('')).toBe('');
  });

  test('should return ipfs gateway link when cidV0 is found', async () => {
    const cidV0 = getIPFSLink('ipfs://QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR');
    await expect(cidV0).toBe(`${IPFS_GATEWAY}QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`);
  });

  test('should return ipfs gateway link when cidV1 is found', async () => {
    const cidV1 = getIPFSLink('ipfs://bafkreigtnlyilggrkgpyjbgdzlxmcc4go3364n62uiq577smnnsoczfo6e');
    await expect(cidV1).toBe(`${IPFS_GATEWAY}bafkreigtnlyilggrkgpyjbgdzlxmcc4go3364n62uiq577smnnsoczfo6e`);
  });

  test('should return ipfs gateway link when doubleIpfs is found', async () => {
    const doubleIpfs = getIPFSLink('ipfs://ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR');
    await expect(doubleIpfs).toBe(`${IPFS_GATEWAY}QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`);
  });

  test('should return ipfs gateway link when defaultIpfs is found', async () => {
    const defaultIpfs = getIPFSLink('https://ipfs.io/ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR');
    await expect(defaultIpfs).toBe(`${IPFS_GATEWAY}QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`);
  });
});
