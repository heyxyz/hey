import { describe, expect, test } from 'vitest';

import getZoraChainInfo from './getZoraChainInfo';

describe('getZoraChainInfo', () => {
  test('should return Ethereum chain info when given chain number 1', () => {
    const chainNumber = 1;
    const expectedInfo = {
      name: 'Ethereum',
      logo: 'https://zora.co/assets/icon/ethereum-eth-logo.svg'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Goerli chain info when given chain number 5', () => {
    const chainNumber = 5;
    const expectedInfo = {
      name: 'Goerli',
      logo: 'https://zora.co/assets/icon/ethereum-eth-logo.svg'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Optimism chain info when given chain number 10', () => {
    const chainNumber = 10;
    const expectedInfo = {
      name: 'Optimism',
      logo: 'https://zora.co/assets/icon/optimism-ethereum-op-logo.svg'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Optimism Testnet chain info when given chain number 420', () => {
    const chainNumber = 420;
    const expectedInfo = {
      name: 'Optimism Testnet',
      logo: 'https://zora.co/assets/icon/optimism-ethereum-op-logo.svg'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Zora chain info when given chain number 7777777', () => {
    const chainNumber = 7777777;
    const expectedInfo = {
      name: 'Zora',
      logo: 'https://zora.co/assets/icon/zora-logo.svg'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Zora Testnet chain info when given chain number 999', () => {
    const chainNumber = 999;
    const expectedInfo = {
      name: 'Zora Testnet',
      logo: 'https://zora.co/assets/icon/zora-logo.svg'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Base chain info when given chain number 8453', () => {
    const chainNumber = 8453;
    const expectedInfo = {
      name: 'Base',
      logo: 'https://zora.co/assets/icon/base-logo.svg'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return Base Testnet chain info when given chain number 84531', () => {
    const chainNumber = 84531;
    const expectedInfo = {
      name: 'Base Testnet',
      logo: 'https://zora.co/assets/icon/base-logo.svg'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return PGN Network chain info when given chain number 424', () => {
    const chainNumber = 424;
    const expectedInfo = {
      name: 'PGN Network',
      logo: 'https://zora.co/assets/icon/pgn-logo.svg'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });

  test('should return default Ethereum chain info when given an unknown chain number', () => {
    const chainNumber = 123;
    const expectedInfo = {
      name: 'Ethereum',
      logo: 'https://zora.co/assets/icon/ethereum-eth-logo.svg'
    };

    expect(getZoraChainInfo(chainNumber)).toEqual(expectedInfo);
  });
});
