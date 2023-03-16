import { expect, test } from '@playwright/test';
import getTokenImage from 'utils/getTokenImage';

test.describe('getTokenImage', () => {
  test('should return the correct image url for a given token symbol', () => {
    expect(getTokenImage('ETH')).toEqual('https://example.com/static/images/tokens/eth.svg');
    expect(getTokenImage('BTC')).toEqual('https://example.com/static/images/tokens/btc.svg');
  });

  test('should convert the token symbol to lowercase before generating the url', () => {
    expect(getTokenImage('Eth')).toEqual('https://example.com/static/images/tokens/eth.svg');
  });
});
