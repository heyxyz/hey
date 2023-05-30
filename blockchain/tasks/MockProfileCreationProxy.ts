import type { SignerWithAddress } from '@nomiclabs/hardhat-ethers/dist/src/signer-with-address';
import { ethers } from 'hardhat';

async function main() {
  const signers: SignerWithAddress[] = await ethers.getSigners();
  console.log('Deployer address:', signers[0].address);
  const mockProfileCreationProxy__factory = await ethers.getContractFactory(
    'MockProfileCreationProxy'
  );
  const mockProfileCreationProxy = await mockProfileCreationProxy__factory.deploy(
    '0x28af365578586eD5Fd500A1Dc0a3E20Fc7b2Cffa', // LensHub
    '0x117F113aEFb9AeD23d901C1fa02fDdaA1d20cCaB' // Linea ENS Resolver
  );
  await mockProfileCreationProxy.deployed();
  await mockProfileCreationProxy.deployTransaction.wait();
  console.log('MockProfileCreationProxy deployed at:', mockProfileCreationProxy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
