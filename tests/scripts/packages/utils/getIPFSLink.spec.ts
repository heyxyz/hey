import { expect, test } from '@playwright/test';
import { IPFS_GATEWAY } from 'data/constants';
import getIPFSLink from 'utils/getIPFSLink';

test.describe('getIPFSLink', () => {
  test('should return empty string when input hash is falsy', () => {
    expect(getIPFSLink('')).toBe('');
  });

  test('should return ipfs gateway link when cidV0 is found', () => {
    const cidV0 = getIPFSLink('ipfs://QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR');
    expect(cidV0).toBe(`${IPFS_GATEWAY}QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`);
  });

  test('should return ipfs gateway link when cidV1 is found', () => {
    const cidV1 = getIPFSLink('ipfs://bafkreigtnlyilggrkgpyjbgdzlxmcc4go3364n62uiq577smnnsoczfo6e');
    expect(cidV1).toBe(`${IPFS_GATEWAY}bafkreigtnlyilggrkgpyjbgdzlxmcc4go3364n62uiq577smnnsoczfo6e`);
  });

  test('should return ipfs gateway link when doubleIpfs is found', () => {
    const doubleIpfs = getIPFSLink('ipfs://ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR');
    expect(doubleIpfs).toBe(`${IPFS_GATEWAY}QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`);
  });

  test('should return ipfs gateway link when defaultIpfs is found', () => {
    const defaultIpfs = getIPFSLink('https://ipfs.io/ipfs/QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR');
    expect(defaultIpfs).toBe(`${IPFS_GATEWAY}QmbWqxBEKC3P8tqsKc98xmWNzrzDtRLMiMPL8wBuTGsMnR`);
  });
});
