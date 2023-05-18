import * as metamask from '@synthetixio/synpress/commands/metamask';
import { WEB_BASE_URL } from 'test/constants';

import { test } from '../../fixtures';

test.beforeEach(async ({ page }) => {
  // baseUrl is set in playwright.config.ts
  await page.goto(`${WEB_BASE_URL}/`);
});

test('connect wallet using default metamask account', async ({ page }) => {
  await metamask.addNetwork({
    networkName: 'Polygon',
    rpcUrl: 'https://polygon.llamarpc.com/rpc/01GYW2YWFWZ1CX3F39CW8YST26',
    chainId: '137',
    symbol: 'Matic',
    isTestnet: false
  });
  await metamask.changeNetwork('Polygon');
  await page.click('#login-button');
  await page.click('#metamask-button');
  await metamask.acceptAccess();
  await page.click('#lenster-login');
  await metamask.confirmSignatureRequest();
  //Uncomment when you place ENVs for wallet
  /*await expect(page.locator('#accounts')).toHaveText(
    '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f'
  ); */
});

test('import private key and connect wallet using imported metamask account', async ({
  page
}) => {
  await metamask.importAccount(
    '0xdbda1821b80551c9d65939329250298aa3472ba22feea921c0cf5d620ea67b97'
  );
  await metamask.addNetwork({
    networkName: 'Polygon',
    rpcUrl: 'https://polygon.llamarpc.com/rpc/01GYW2YWFWZ1CX3F39CW8YST26',
    chainId: '137',
    symbol: 'Matic',
    isTestnet: false
  });
  await metamask.changeNetwork('Polygon');
  await page.click('#login-button');
  await page.click('#metamask-button');
  await metamask.acceptAccess();
  await page.click('#lenster-login');
  await metamask.confirmSignatureRequest();
  //needs a lens account for this to work
  /* await expect(page.locator('#accounts')).toHaveText(
    '0x23618e81e3f5cdf7f54c3d65f7fbc0abf5b21e8f'
  ); */
});
