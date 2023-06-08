# Lens Protocol - Contracts

To provide the best experience possible on Lineaster, we have a dedicated `MockProfileCreationProxy` contract, and the
tooling to deploy it.

This contract aims to create Lens handles, with 2 restrictions:

- Only one handle per address
- The creator must already have a Linea ENS registration

## How to use?

1. Add your secrets

   1. Copy the `.env.example` file to a `.env` file
   2. Fill it with your Infura URL + Infura key
   3. Add your private key

2. Install dependencies

   ```
      npm install
   ```

3. Compile contract

   ```
      npm run compile
   ```

4. Deploy contract

   ```
      npm run deploy
   ```

5. Verify contract on explorer

   1. Flatten contract

      ```
         npm run flatten
      ```

   2. Copy the content of `Flattened.sol` and use it in the verification process
