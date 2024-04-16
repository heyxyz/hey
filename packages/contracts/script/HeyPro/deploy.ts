const hre = require('hardhat');

async function deployProxy() {
  const owner = '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF';
  const monthlyPrice = '5000000000000000000'; // 5 MATIC
  const yearlyPrice = '54000000000000000000'; // 54 MATIC

  const HeyPro = await hre.ethers.getContractFactory('HeyPro');
  const deployProxy = await hre.upgrades.deployProxy(HeyPro, [
    owner,
    monthlyPrice,
    yearlyPrice
  ]);
  await deployProxy.waitForDeployment();

  console.log(`HeyPro deployed to ${await deployProxy.getAddress()}`);
}

deployProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
