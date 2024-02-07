const hre = require('hardhat');

async function deployProxy() {
  const owner = '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF';
  const permissionlessCreator = '0x42b302BBB4fA27c21d32EdF602E4e2aA65746999';

  const HeyLensSignup = await hre.ethers.getContractFactory('HeyLensSignup');
  const deployProxy = await hre.upgrades.deployProxy(HeyLensSignup, [
    permissionlessCreator,
    owner
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
