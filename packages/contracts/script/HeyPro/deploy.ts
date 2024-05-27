import hre from 'hardhat';

async function deployProxy() {
  const owner = '0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF';
  const monthlyPrice = '8000000000000000000'; // 8 MATIC
  const yearlyPrice = '90000000000000000000'; // 90 MATIC

  const HeyPro = await hre.ethers.getContractFactory('HeyPro');
  const deployProxy = await hre.upgrades.deployProxy(HeyPro as any, [
    owner,
    monthlyPrice,
    yearlyPrice
  ]);
  await deployProxy.deployed();

  console.log(`HeyPro deployed to ${await deployProxy.address}`);
}

deployProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
