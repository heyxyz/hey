import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { ethers } from 'hardhat';

async function main() {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  console.log('Deployer address:', signers[0].address);
  const mockProfileCreationProxy__factory = await ethers.getContractFactory(
    'MockProfileCreationProxy'
  );
  const mockProfileCreationProxy = await mockProfileCreationProxy__factory.deploy(
    '0x97F1d4aFE1A3D501731ca7993fE6E518F4FbcE76',
    '0x117F113aEFb9AeD23d901C1fa02fDdaA1d20cCaB'
  );
  await mockProfileCreationProxy.deployed();
  await mockProfileCreationProxy.deployTransaction.wait();
  console.log('MockProfileCreationProxy deployed at:', mockProfileCreationProxy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
