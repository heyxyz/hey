import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { ethers } from 'hardhat';

async function main() {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  console.log('Deployer address:', signers[0].address);
  const mockProfileCreationProxy__factory = await ethers.getContractFactory(
    'MockProfileCreationProxy'
  );
  const mockProfileCreationProxy = await mockProfileCreationProxy__factory.deploy(
    signers[0].address
  );
  await mockProfileCreationProxy.deployed();
  await mockProfileCreationProxy.deployTransaction.wait();
  console.log('MockProfileCreationProxy deployed at:', mockProfileCreationProxy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
