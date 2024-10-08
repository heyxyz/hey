import hre from "hardhat";

async function deployProxy() {
  const owner = "0x03Ba34f6Ea1496fa316873CF8350A3f7eaD317EF";
  const feesBps = "500"; // 5%

  const HeyTipping = await hre.ethers.getContractFactory("HeyTipping");
  const deployProxy = await hre.upgrades.deployProxy(HeyTipping as any, [
    owner,
    feesBps
  ]);
  await deployProxy.deployed();

  console.log(`HeyTipping deployed to ${await deployProxy.address}`);
}

deployProxy().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
