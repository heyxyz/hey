import { STATIC_IMAGES_URL } from '@hey/data/constants';
import { describe, expect, test } from 'vitest';

import getZoraChainInfo from './getZoraChainInfo';

describe('getZoraChainInfo', () => {
  test('should return Ethereum chain info when given chain number 1', () => {
    const chainNumber = 1;
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/ethereum.svg`,
      name: 'Ethereum'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Goerli chain info when given chain number 5', () => {
    const chainNumber = 5;
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/ethereum.svg`,
      name: 'Goerli'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Optimism chain info when given chain number 10', () => {
    const chainNumber = 10;
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/optimism.svg`,
      name: 'Optimism'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Optimism Testnet chain info when given chain number 420', () => {
    const chainNumber = 420;
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/optimism.svg`,
      name: 'Optimism Testnet'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Zora chain info when given chain number 7777777', () => {
    const chainNumber = 7777777;
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/zora.svg`,
      name: 'Zora'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Zora Testnet chain info when given chain number 999', () => {
    const chainNumber = 999;
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/zora.svg`,
      name: 'Zora Testnet'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Base chain info when given chain number 8453', () => {
    const chainNumber = 8453;
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/base.svg`,
      name: 'Base'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Base Testnet chain info when given chain number 84531', () => {
    const chainNumber = 84531;
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/base.svg`,
      name: 'Base Testnet'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return PGN Network chain info when given chain number 424', () => {
    const chainNumber = 424;
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/pgn.svg`,
      name: 'PGN Network'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return default Ethereum chain info when given an unknown chain number', () => {
    const chainNumber = 123;
    const expectedInfo = {
      logo: `${STATIC_IMAGES_URL}/chains/ethereum.svg`,
      name: 'Ethereum'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });
});
