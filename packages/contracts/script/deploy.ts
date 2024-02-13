const hre = require('hardhat');

async function deployProxy() {
  const owner = '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF';
  const lensPermissionlessCreator =
    '0x0b5e6100243f793e480DE6088dE6bA70aA9f3872';
  const signupPrice = '1000000000000000000';

  const HeyLensSignup = await hre.ethers.getContractFactory('HeyLensSignup');
  const deployProxy = await hre.upgrades.deployProxy(HeyLensSignup, [
    owner,
    lensPermissionlessCreator,
    signupPrice
  ]);
  await deployProxy.waitForDeployment();

  console.log(`HeyLensSignup deployed to ${await deployProxy.getAddress()}`);
}

deployProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// async function upgradeProxy() {
//   const PROXY_ADDRESS = '0x5BF1670092A4890ccfcbDBa704995AeDcBBb83CF';

//   const HeyLensSignupV2 =
//     await hre.ethers.getContractFactory('HeyLensSignupV2');
//   await hre.upgrades.upgradeProxy(PROXY_ADDRESS, HeyLensSignupV2);
//   console.log('Proxy upgraded');
// }

// upgradeProxy().catch((error) => {
//   console.error(error);
//   process.exitCode = 1;
// });
