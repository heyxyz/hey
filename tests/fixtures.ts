// eslint-disable-next-line no-restricted-imports
import { type BrowserContext, chromium, test as base } from '@playwright/test';
import { initialSetup } from '@synthetixio/synpress/commands/metamask';
import { prepareMetamask } from '@synthetixio/synpress/helpers';

type TestFixtures = {
  context: BrowserContext;
};

export const test = base.extend<TestFixtures>({
  // eslint-disable-next-line no-empty-pattern
  context: async ({}, use) => {
    /* if (
      !process.env.ADDRESS ||
      !process.env.SEED_PHRASE ||
      !process.env.PASSWORD
    ) {
      throw new Error(
        'To connect a wallet, set the following environment variables: wallet ADDRESS, SEED_PHRASE and PASSWORD'
      );
    } */

    // download metamask
    const metamaskPath = await prepareMetamask(
      process.env.METAMASK_VERSION || '10.25.0'
    );

    // prepare browser args
    const browserArgs = [
      '--accept-lang=en',
      `--disable-extensions-except=${metamaskPath}`,
      `--load-extension=${metamaskPath}`,
      '--remote-debugging-port=9222'
    ];
    if (process.env.CI) {
      browserArgs.push('--disable-gpu');
    }
    if (process.env.HEADLESS_MODE) {
      browserArgs.push('--headless=new');
    }
    // launch browser
    const context = await chromium.launchPersistentContext('', {
      headless: true,
      args: browserArgs
    });
    // wait for metamask
    await context.pages()[0].waitForTimeout(3000);

    // close empty tab
    await context.pages()[0].close();

    // setup metamask
    await initialSetup(chromium, {
      secretWordsOrPrivateKey:
        'test test test test test test test test test test test junk',
      network: 'sepolia',
      password: 'Tester@1234',
      enableAdvancedSettings: true
    });

    await use(context);
    if (!process.env.SERIAL_MODE) {
      await context.close();
    }
  }
});
export const { expect } = test;
