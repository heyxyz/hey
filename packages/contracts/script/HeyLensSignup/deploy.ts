const hre = require('hardhat');

async function deployProxy() {
  const owner = '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF';
  // Amoy: 0x36440da1D98FF46637f0b98AAA082bc77977B49B
  // Mainnet: 0x0b5e6100243f793e480DE6088dE6bA70aA9f3872
  const lensPermissionlessCreator =
    '0x0b5e6100243f793e480DE6088dE6bA70aA9f3872';
  const signupPrice = '1000000000000000000';

  const HeyLensSignup = await hre.ethers.getContractFactory('HeyLensSignupV2');
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
