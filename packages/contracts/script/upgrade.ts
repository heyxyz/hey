const hre = require('hardhat');

async function upgradeProxy() {
  const PROXY_ADDRESS = '0x6d131f44fBB08D463D18394Ada64BE59519339e3';

  const HeyLensSignupV2 =
    await hre.ethers.getContractFactory('HeyLensSignupV2');
  await hre.upgrades.upgradeProxy(PROXY_ADDRESS, HeyLensSignupV2);
  console.log('Proxy upgraded');
}

upgradeProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
