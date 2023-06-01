import { MainnetContracts } from '@lenster/data/contracts';
import getAssetAddress from '@lenster/lib/getAssetAddress';
import { expect, test } from '@playwright/test';

test.describe('getAssetAddress', () => {
  test('should return MAINNET_DEFAULT_TOKEN for WMATIC', () => {
    const symbol = 'WMATIC';
    const result = getAssetAddress(symbol);
    expect(result).toEqual(MainnetContracts.DefaultToken);
  });

  test("should return '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619' for WETH", () => {
    const symbol = 'WETH';
    const result = getAssetAddress(symbol);
    expect(result).toEqual('0x7ceb23fd6bc0add59e62ac25578270cff1b9f619');
  });

  test("should return '0x2791bca1f2de4661ed88a30c99a7a9449aa84174' for USDC", () => {
    const symbol = 'USDC';
    const result = getAssetAddress(symbol);
    expect(result).toEqual('0x2791bca1f2de4661ed88a30c99a7a9449aa84174');
  });

  test("should return '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063' for DAI", () => {
    const symbol = 'DAI';
    const result = getAssetAddress(symbol);
    expect(result).toEqual('0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063');
  });

  test("should return '0xD838290e877E0188a4A44700463419ED96c16107' for NCT", () => {
    const symbol = 'NCT';
    const result = getAssetAddress(symbol);
    expect(result).toEqual('0xD838290e877E0188a4A44700463419ED96c16107');
  });

  test('should return MAINNET_DEFAULT_TOKEN for any other symbol', () => {
    const symbol = 'FOO';
    const result = getAssetAddress(symbol);
    expect(result).toEqual(MainnetContracts.DefaultToken);
  });
});
