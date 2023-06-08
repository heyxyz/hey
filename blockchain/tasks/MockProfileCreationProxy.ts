import { LENS_HUB, LINEA_RESOLVER } from '../../packages/data';
import { ethers } from 'hardhat';

async function main() {
  const contractName = 'MockProfileCreationProxy';
  const contract = await ethers.deployContract(contractName, [LENS_HUB, LINEA_RESOLVER]);
  const contractAddress = await contract.getAddress();
  const tx = await contract.deploymentTransaction();
  const txHash = tx?.hash;
  console.log(
    `${contractName} deploying in transaction ${txHash} => https://explorer.goerli.linea.build/tx/${txHash}`
  );
  console.log(
    `${contractName} deploying at ${contractAddress} => https://explorer.goerli.linea.build/address/${contractAddress}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
