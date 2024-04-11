const hre = require('hardhat');

async function upgradeProxy() {
  const PROXY_ADDRESS = '0x82Bcb5DA51c6F3D0Ce942bDBEbb0B8A7774d62e8';

  const HeyLensSignupV2 =
    await hre.ethers.getContractFactory('HeyLensSignupV2');
  await hre.upgrades.upgradeProxy(PROXY_ADDRESS, HeyLensSignupV2);
  console.log('Proxy upgraded');
}

upgradeProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
