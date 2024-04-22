const hre = require('hardhat');

async function deployProxy() {
  const owner = '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF';

  const HeyTipping = await hre.ethers.getContractFactory('HeyTipping');
  const deployProxy = await hre.upgrades.deployProxy(HeyTipping, [owner]);
  await deployProxy.waitForDeployment();

  console.log(`HeyTipping deployed to ${await deployProxy.getAddress()}`);
}

deployProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
