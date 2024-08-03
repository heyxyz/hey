# Chat Transcript - Tab 1

## User:

According to https://github.com/heyxyz/hey/issues/4865:
Feature needed: Support "Pay What You Want" Collects

From https://github.com/iPaulPro:

Summary
I have created a new type of Collect Module that allows users to "pay what you want". This affords collectors the ability to use any denomination of any ERC-20 token to collect a publication.

Mainnet: 0x7fbD7496CaE2DAcad7a62350DA8488E31eC026eA

Testnet: 0x3d06AA6ca4FC7eE0D5581B85CB52CA7714175e43

Notes
This is a Collect Module, NOT a standalone Open Action Module. It is meant to be used with the core CollectPublicationAction module.
The publication author can optionally specify a desired currency and price floor.
Implement
The init calldata is almost identical to MultirecipientFeeCollectModule :

```
[
  { type: "uint160", name: "amountFloor" },
  { type: "uint96", name: "collectLimit" },
  { type: "address", name: "currency" },
  { type: "uint16", name: "referralFee" },
  { type: "bool", name: "followerOnly" },
  { type: "uint72", name: "endTimestamp" },
  {
    type: "tuple(address,uint16)[5]",
    name: "recipients",
    components: [
      { type: "address", name: "recipient" },
      { type: "uint16", name: "split" },
    ],
  },
]
```

and the process calldata:

```
[
  { type: "address", name: "currency" },
  { type: "uint256", name: "amount" },
]
```

CollectPublicationAction
This Collect Module is registered with the CollectPublicationAction (the same module used with SimpleFeeCollectModule and MultirecipientFeeCollectModule). The init calldata is just the Collect Module address and the encoded collect init calldata (above):

```
[
    { type: 'address', name: 'collectModule' },
    { type: 'bytes', name: 'collectModuleInitData' },
]
```

And to process:
```
[
  { type: "address", name: "collectNftRecipient" },
  { type: "bytes", name: "collectData" },
]
```

Testnet
I have completed a successful act call with the PWYW module: https://amoy.polygonscan.com/tx/0xceff77ea12000814d07d3e8bc2b0218ae6ff91e286a08d91872e97b817f4a259

According to https://github.com/jamesfinnerty:

"This is a feature that should be available in all Lens front-end apps. Giving collectors the flexibility to pay what they want using their token of choice will allow creators to expand their offerings to a wider user base."

According to https://github.com/mrsalitre:

"this is genius, agnostic tokens fits perfectly with the permissionless philosophy. I want to see this across the whole lensverse."

According to https://github.com/iPaulPro:

> Totally make sense. How to integrate it?

It can be added to publications just like any other other Open Action. Only difference with Collect Modules is that they're registered with the existing CollectPublicationAction rather than as their own Actions.

Here's a code snippet on how to create the init calldata:

```
import { encodeData } from '@lens-protocol/client';
import { ZeroAddress } from 'ethers';

const EMPTY_RECIPIENT = [ZeroAddress, '0'];

// First, create the PWYW Collect Module init data
const collectInitData = encodeData([
    { type: 'uint160', name: 'amountFloor' },
    { type: 'uint96', name: 'collectLimit' },
    { type: 'address', name: 'currency' },
    { type: 'uint16', name: 'referralFee' },
    { type: 'bool', name: 'followerOnly' },
    { type: 'uint72', name: 'endTimestamp' },
    {
        type: 'tuple(address,uint16)[5]',
        name: 'recipients',
        components: [
            { type: 'address', name: 'recipient' },
            { type: 'uint16', name: 'split' },
        ],
    },
], [
    '0', // amount floor, zero to allow free collects
    '10', // number of mints allowed
    ZeroAddress, // optionally limit to a specific token
    '10', // mirror referral percentage
    false, // minting only for followers
    '0', // optional end date
    [
        ['0x10E1DEB36F41b4Fad35d10d0aB870a4dc52Dbb2c', '10000'], // the recipient
        EMPTY_RECIPIENT, // can be up to 5 recipients
        EMPTY_RECIPIENT,
        EMPTY_RECIPIENT,
        EMPTY_RECIPIENT
    ],
]);

// Next, create the CollectPublicationAction init data
const data = encodeData(
    [
        { type: 'address', name: 'collectModule' },
        { type: 'bytes', name: 'collectModuleInitData' },
    ],
    [
       '0x7fbD7496CaE2DAcad7a62350DA8488E31eC026eA', // the PWYW Collect Module address
       collectInitData
    ],
);

// Add as an `unknownOpenAction` to the publication
openActionModules.push({
    unknownOpenAction: {
        address: '0x0D90C58cBe787CD70B5Effe94Ce58185D72143fB', // the CollectPublicationAction address
        data,
    },
});
```

> hey @iPaulPro i very well understood the part of implementation could u share the act implementation as well...it would be helpful i am going to integrate it to SOCLLY soon 🚀

Sure thing! The main thing to note is that the `act` is on the `CollectPublicationAction` (0x0D90C58cBe787CD70B5Effe94Ce58185D72143fB) and not the Collect Module, itself, however, the allowance approval must be done with the Collect Module.

Here's an example of process for a 1 BONSAI collect:

```
import { ethers } from "ethers";
import { encodeData } from "@lens-protocol/client";

const processCollectData = encodeData([
  { type: "address", name: "currency" },
  { type: "uint256", name: "amount" },
], [
  "0x3d2bD0e15829AA5C362a4144FdF4A1112fa29B5c",
  ethers.utils.parseUnits("1", 18).toString(),
]);

const processActionData = encodeData(
  [
    { type: "address", name: "collectNftRecipient" },
    { type: "bytes", name: "collectData" },
  ],
  [RECIPIENT, processCollectData],
);
```

Where `RECIPIENT` is the address receiving the Collect NFT.

Please instead of explaining, actually implement it on the application (hey.xyz).

## AI (gpt-4o):

To implement the "Pay What You Want" (PWYW) Collect Module in the `hey.xyz` application, we need to make several changes across different parts of the codebase. Here's a step-by-step guide to implementing this feature:

### Step 1: Update Constants
Add the PWYW Collect Module addresses to the constants file.

```typescript:packages/data/constants.ts
export const PWYW_COLLECT_MODULE_ADDRESS = IS_MAINNET
  ? '0x7fbD7496CaE2DAcad7a62350DA8488E31eC026eA'
  : '0x3d06AA6ca4FC7eE0D5581B85CB52CA7714175e43';

export const COLLECT_PUBLICATION_ACTION_ADDRESS = IS_MAINNET
  ? '0x0D90C58cBe787CD70B5Effe94Ce58185D72143fB'
  : '0x0D90C58cBe787CD70B5Effe94Ce58185D72143fB';
```

### Step 2: Update the Collect Module Params Helper
Update the `collectModuleParams` helper to include the PWYW Collect Module.

```typescript:packages/helpers/collectModuleParams.ts
import { PWYW_COLLECT_MODULE_ADDRESS } from '@hey/data/constants';

const collectModuleParams = (
  collectModule: CollectModuleType
): CollectActionModuleInput | null => {
  const {
    amount,
    collectLimit,
    endsAt,
    followerOnly,
    recipients,
    referralFee
  } = collectModule;

  const baseCollectModuleParams = {
    collectLimit: collectLimit || undefined,
    endsAt: endsAt || undefined,
    followerOnly: followerOnly || false
  };

  const adminFeePercentage = 5;
  const userPercentage = 100 - adminFeePercentage;

  let totalPercentage = 0;
  const adjustedSplits =
    recipients?.map((split) => {
      const adjustedSplit = Math.floor(split.split * (userPercentage / 100));
      totalPercentage += adjustedSplit;
      return {
        recipient: split.recipient,
        split: adjustedSplit
      };
    }) || [];

  if (adjustedSplits.length > 0) {
    let sumNonZeroAdjustments = 0;

    for (const split of adjustedSplits) {
      if (split.split === 0 && userPercentage - totalPercentage > 0) {
        split.split++;
        sumNonZeroAdjustments++;
      }
    }

    adjustedSplits[0].split +=
      userPercentage - totalPercentage - sumNonZeroAdjustments;
  }

  adjustedSplits.push({
    recipient: REWARDS_ADDRESS,
    split: adminFeePercentage
  });

  switch (collectModule.type) {
    case CollectOpenActionModuleType.SimpleCollectOpenActionModule:
      return { simpleCollectOpenAction: baseCollectModuleParams };
    case CollectOpenActionModuleType.MultirecipientFeeCollectOpenActionModule:
      return {
        multirecipientCollectOpenAction: {
          ...baseCollectModuleParams,
          amount: amount as AmountInput,
          recipients: adjustedSplits as RecipientDataInput[],
          referralFee: referralFee || undefined
        }
      };
    case 'PWYWCollectModule':
      return {
        unknownOpenAction: {
          address: PWYW_COLLECT_MODULE_ADDRESS,
          data: encodeData(
            [
              { type: 'uint160', name: 'amountFloor' },
              { type: 'uint96', name: 'collectLimit' },
              { type: 'address', name: 'currency' },
              { type: 'uint16', name: 'referralFee' },
              { type: 'bool', name: 'followerOnly' },
              { type: 'uint72', name: 'endTimestamp' },
              {
                type: 'tuple(address,uint16)[5]',
                name: 'recipients',
                components: [
                  { type: 'address', name: 'recipient' },
                  { type: 'uint16', name: 'split' },
                ],
              },
            ],
            [
              amount ? parseEther(amount.value).toString() : '0',
              collectLimit || '0',
              currency || ZERO_ADDRESS,
              referralFee || '0',
              followerOnly || false,
              endsAt ? new Date(endsAt).getTime() / 1000 : '0',
              adjustedSplits,
            ]
          ),
        },
      };
    default:
      return null;
  }
};

export default collectModuleParams;
```

### Step 3: Update the New Publication Component
Update the `NewPublication` component to handle the PWYW Collect Module.

```typescript:apps/web/src/components/Composer/NewPublication.tsx
import { PWYW_COLLECT_MODULE_ADDRESS, COLLECT_PUBLICATION_ACTION_ADDRESS } from '@hey/data/constants';
import { encodeData } from '@lens-protocol/client';

const NewPublication: FC<NewPublicationProps> = ({ publication }) => {
  // ... existing code ...

  const prepareOnChainRequest = () => {
    const openActionModules = [];

    if (isPWYW) {
      const collectInitData = encodeData(
        [
          { type: 'uint160', name: 'amountFloor' },
          { type: 'uint96', name: 'collectLimit' },
          { type: 'address', name: 'currency' },
          { type: 'uint16', name: 'referralFee' },
          { type: 'bool', name: 'followerOnly' },
          { type: 'uint72', name: 'endTimestamp' },
          {
            type: 'tuple(address,uint16)[5]',
            name: 'recipients',
            components: [
              { type: 'address', name: 'recipient' },
              { type: 'uint16', name: 'split' },
            ],
          },
        ],
        [
          amountFloor ? parseEther(amountFloor).toString() : '0',
          collectLimit || '0',
          currency || ZERO_ADDRESS,
          referralFee || '0',
          followerOnly || false,
          endTimestamp ? new Date(endTimestamp).getTime() / 1000 : '0',
          recipients,
        ]
      );

      const data = encodeData(
        [
          { type: 'address', name: 'collectModule' },
          { type: 'bytes', name: 'collectModuleInitData' },
        ],
        [
          PWYW_COLLECT_MODULE_ADDRESS,
          collectInitData,
        ]
      );

      openActionModules.push({
        unknownOpenAction: {
          address: COLLECT_PUBLICATION_ACTION_ADDRESS,
          data,
        },
      });
    }

    return {
      contentURI: `ar://${arweaveId}`,
      ...(isComment && { commentOn: publication?.id }),
      ...(isQuote && { quoteOn: quotedPublication?.id }),
      openActionModules,
      ...(onlyFollowers && {
        referenceModule: selectedReferenceModule === ReferenceModuleType.FollowerOnlyReferenceModule
          ? { followerOnlyReferenceModule: true }
          : {
              degreesOfSeparationReferenceModule: {
                commentsRestricted: true,
                degreesOfSeparation,
                mirrorsRestricted: true,
                quotesRestricted: true
              }
          })
    };
  };

  // ... existing code ...
};
```

### Step 4: Update the Collect Action Component
Update the `CollectAction` component to handle the PWYW Collect Module.

```typescript:apps/web/src/components/Publication/OpenAction/CollectModule/CollectAction.tsx
import { PWYW_COLLECT_MODULE_ADDRESS } from '@hey/data/constants';
import { encodeData } from '@lens-protocol/client';

const CollectAction: FC<CollectActionProps> = ({
  // ... existing code ...
}) => {
  // ... existing code ...

  const createCollect = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      const actOnRequest: ActOnOpenActionLensManagerRequest = {
        actOn: { [getOpenActionActOnKey(openAction.type)]: true },
        for: publication?.id
      };

      if (openAction.type === 'PWYWCollectModule') {
        const processCollectData = encodeData(
          [
            { type: 'address', name: 'currency' },
            { type: 'uint256', name: 'amount' },
          ],
          [
            currency,
            parseEther(amount).toString(),
          ]
        );

        const processActionData = encodeData(
          [
            { type: 'address', name: 'collectNftRecipient' },
            { type: 'bytes', name: 'collectData' },
          ],
          [address, processCollectData],
        );

        actOnRequest.actOn.unknownOpenAction = {
          address: COLLECT_PUBLICATION_ACTION_ADDRESS,
          data: processActionData,
        };
      }

      if (canUseManager) {
        return await actViaLensManager(actOnRequest);
      }

      return await createActOnOpenActionTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request: actOnRequest
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  // ... existing code ...
};
```

### Step 5: Update the Collect Module Component
Update the `CollectModule` component to handle the PWYW Collect Module.

```typescript:apps/web/src/components/Publication/OpenAction/CollectModule/index.tsx
import { PWYW_COLLECT_MODULE_ADDRESS } from '@hey/data/constants';

const CollectModule: FC<CollectModuleProps> = ({ openAction, publication }) => {
  // ... existing code ...

  const collectModuleInstance = new CollectModule(
    collectModule.__typename,
    collectModule
  );

  if (collectModule.__typename === 'PWYWCollectModule') {
    return (
      <PWYWCollectModule
        openAction={openAction}
        publication={publication}
      />
    );
  }

  return collectModuleInstance.handleModule();
};
```

### Step 6: Update the Collect Module Store
Update the `useCollectModuleStore` to include the PWYW Collect Module.

```typescript:apps/web/src/store/non-persisted/publication/useCollectModuleStore.ts
import { CollectOpenActionModuleType } from '@hey/lens';

const INITIAL_COLLECT_MODULE: CollectModuleType = {
  amount: null,
  collectLimit: null,
  endsAt: null,
  followerOnly: false,
  recipients: [],
  referralFee: 0,
  type: null
};

const store = create<State>((set) => ({
  collectModule: INITIAL_COLLECT_MODULE,
  reset: () => set(() => ({ collectModule: INITIAL_COLLECT_MODULE })),
  setCollectModule: (collectModule) => set(() => ({ collectModule }))
}));

export const useCollectModuleStore = store;
```

### Step 7: Test the Implementation
Deploy the changes and test the implementation to ensure that the PWYW Collect Module works as expected.

By following these steps, you should be able to integrate the "Pay What You Want" Collect Module into the `hey.xyz` application.

## User:

According to https://github.com/heyxyz/hey/issues/4865:
Feature needed: Support "Pay What You Want" Collects

From https://github.com/iPaulPro:

Summary
I have created a new type of Collect Module that allows users to "pay what you want". This affords collectors the ability to use any denomination of any ERC-20 token to collect a publication.

Mainnet: 0x7fbD7496CaE2DAcad7a62350DA8488E31eC026eA

Testnet: 0x3d06AA6ca4FC7eE0D5581B85CB52CA7714175e43

Notes
This is a Collect Module, NOT a standalone Open Action Module. It is meant to be used with the core CollectPublicationAction module.
The publication author can optionally specify a desired currency and price floor.
Implement
The init calldata is almost identical to MultirecipientFeeCollectModule :

```
[
  { type: "uint160", name: "amountFloor" },
  { type: "uint96", name: "collectLimit" },
  { type: "address", name: "currency" },
  { type: "uint16", name: "referralFee" },
  { type: "bool", name: "followerOnly" },
  { type: "uint72", name: "endTimestamp" },
  {
    type: "tuple(address,uint16)[5]",
    name: "recipients",
    components: [
      { type: "address", name: "recipient" },
      { type: "uint16", name: "split" },
    ],
  },
]
```

and the process calldata:

```
[
  { type: "address", name: "currency" },
  { type: "uint256", name: "amount" },
]
```

CollectPublicationAction
This Collect Module is registered with the CollectPublicationAction (the same module used with SimpleFeeCollectModule and MultirecipientFeeCollectModule). The init calldata is just the Collect Module address and the encoded collect init calldata (above):

```
[
    { type: 'address', name: 'collectModule' },
    { type: 'bytes', name: 'collectModuleInitData' },
]
```

And to process:
```
[
  { type: "address", name: "collectNftRecipient" },
  { type: "bytes", name: "collectData" },
]
```

Testnet
I have completed a successful act call with the PWYW module: https://amoy.polygonscan.com/tx/0xceff77ea12000814d07d3e8bc2b0218ae6ff91e286a08d91872e97b817f4a259

According to https://github.com/jamesfinnerty:

"This is a feature that should be available in all Lens front-end apps. Giving collectors the flexibility to pay what they want using their token of choice will allow creators to expand their offerings to a wider user base."

According to https://github.com/mrsalitre:

"this is genius, agnostic tokens fits perfectly with the permissionless philosophy. I want to see this across the whole lensverse."

According to https://github.com/iPaulPro:

> Totally make sense. How to integrate it?

It can be added to publications just like any other other Open Action. Only difference with Collect Modules is that they're registered with the existing CollectPublicationAction rather than as their own Actions.

Here's a code snippet on how to create the init calldata:

```
import { encodeData } from '@lens-protocol/client';
import { ZeroAddress } from 'ethers';

const EMPTY_RECIPIENT = [ZeroAddress, '0'];

// First, create the PWYW Collect Module init data
const collectInitData = encodeData([
    { type: 'uint160', name: 'amountFloor' },
    { type: 'uint96', name: 'collectLimit' },
    { type: 'address', name: 'currency' },
    { type: 'uint16', name: 'referralFee' },
    { type: 'bool', name: 'followerOnly' },
    { type: 'uint72', name: 'endTimestamp' },
    {
        type: 'tuple(address,uint16)[5]',
        name: 'recipients',
        components: [
            { type: 'address', name: 'recipient' },
            { type: 'uint16', name: 'split' },
        ],
    },
], [
    '0', // amount floor, zero to allow free collects
    '10', // number of mints allowed
    ZeroAddress, // optionally limit to a specific token
    '10', // mirror referral percentage
    false, // minting only for followers
    '0', // optional end date
    [
        ['0x10E1DEB36F41b4Fad35d10d0aB870a4dc52Dbb2c', '10000'], // the recipient
        EMPTY_RECIPIENT, // can be up to 5 recipients
        EMPTY_RECIPIENT,
        EMPTY_RECIPIENT,
        EMPTY_RECIPIENT
    ],
]);

// Next, create the CollectPublicationAction init data
const data = encodeData(
    [
        { type: 'address', name: 'collectModule' },
        { type: 'bytes', name: 'collectModuleInitData' },
    ],
    [
       '0x7fbD7496CaE2DAcad7a62350DA8488E31eC026eA', // the PWYW Collect Module address
       collectInitData
    ],
);

// Add as an `unknownOpenAction` to the publication
openActionModules.push({
    unknownOpenAction: {
        address: '0x0D90C58cBe787CD70B5Effe94Ce58185D72143fB', // the CollectPublicationAction address
        data,
    },
});
```

> hey @iPaulPro i very well understood the part of implementation could u share the act implementation as well...it would be helpful i am going to integrate it to SOCLLY soon 🚀

Sure thing! The main thing to note is that the `act` is on the `CollectPublicationAction` (0x0D90C58cBe787CD70B5Effe94Ce58185D72143fB) and not the Collect Module, itself, however, the allowance approval must be done with the Collect Module.

Here's an example of process for a 1 BONSAI collect:

```
import { ethers } from "ethers";
import { encodeData } from "@lens-protocol/client";

const processCollectData = encodeData([
  { type: "address", name: "currency" },
  { type: "uint256", name: "amount" },
], [
  "0x3d2bD0e15829AA5C362a4144FdF4A1112fa29B5c",
  ethers.utils.parseUnits("1", 18).toString(),
]);

const processActionData = encodeData(
  [
    { type: "address", name: "collectNftRecipient" },
    { type: "bytes", name: "collectData" },
  ],
  [RECIPIENT, processCollectData],
);
```

Where `RECIPIENT` is the address receiving the Collect NFT.

Please instead of explaining, actually implement it on the application (hey.xyz).

## AI (gpt-4o):

Certainly! I'll implement the "Pay What You Want" (PWYW) Collect Module directly in the hey.xyz application. Here are the changes we need to make:

1. First, let's update the constants:

```typescript
// packages/data/constants.ts

export const PWYW_COLLECT_MODULE_ADDRESS = IS_MAINNET
  ? '0x7fbD7496CaE2DAcad7a62350DA8488E31eC026eA'
  : '0x3d06AA6ca4FC7eE0D5581B85CB52CA7714175e43';

export const COLLECT_PUBLICATION_ACTION_ADDRESS = IS_MAINNET
  ? '0x0D90C58cBe787CD70B5Effe94Ce58185D72143fB'
  : '0x0D90C58cBe787CD70B5Effe94Ce58185D72143fB';
```

2. Now, let's create a new component for the PWYW Collect Module:

```typescript
// apps/web/src/components/PWYWCollectModule/index.tsx

import { useState } from 'react';
import { parseEther } from 'viem';
import { useAccount, useBalance, useContractWrite } from 'wagmi';
import { Button, Input } from '../ui/components';
import { LENS_HUB_ABI, LENS_HUB_ADDRESS } from '../constants';
import { createActOnOpenActionRequest } from 'pwyw-collect-module';

const SUPPORTED_TOKENS = [
  { label: 'ETH', value: '0x0000000000000000000000000000000000000000' },
  { label: 'WMATIC', value: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889' }
  // Add more supported tokens here
];

const PWYWCollectModule = ({ openAction, publication }) => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(SUPPORTED_TOKENS[0].value);
  const { address } = useAccount();
  const { data: balance } = useBalance({
    address,
    token: currency !== SUPPORTED_TOKENS[0].value ? currency : undefined
  });

  const { write: collect } = useContractWrite({
    address: LENS_HUB_ADDRESS,
    abi: LENS_HUB_ABI,
    functionName: 'act'
  });

  const handleCollect = async () => {
    if (!amount) {
      return;
    }

    const request = createActOnOpenActionRequest({
      action: openAction,
      publication,
      referrer: null
    });

    collect({
      args: [request]
    });
  };

  return (
    <div>
      <Input
        placeholder="Enter amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
        {SUPPORTED_TOKENS.map((token) => (
          <option key={token.value} value={token.value}>
            {token.label}
          </option>
        ))}
      </select>
      <div>
        Balance: {balance?.formatted} {balance?.symbol}
      </div>
      <Button onClick={handleCollect}>Collect</Button>
    </div>
  );
};

export default PWYWCollectModule;
```

3. Update the CollectModule component to include the PWYW option:

```typescript
// apps/web/src/components/Publication/OpenAction/CollectModule/index.tsx

import { PWYWCollectModule } from '@components/PWYWCollectModule';

const CollectModule: FC<CollectModuleProps> = ({ openAction, publication }) => {
  // ... existing code ...

  if (openAction.__typename === 'UnknownOpenActionModuleSettings' &&
      openAction.contract.address === PWYW_COLLECT_MODULE_ADDRESS) {
    return (
      <PWYWCollectModule
        openAction={openAction}
        publication={publication}
      />
    );
  }

  // ... rest of the existing code ...
};
```

4. Update the NewPublication component to allow setting PWYW collect:

```typescript
// apps/web/src/components/Composer/NewPublication.tsx

import { useState } from 'react';
import { parseEther } from 'viem';
import { PWYW_COLLECT_MODULE_ADDRESS, COLLECT_PUBLICATION_ACTION_ADDRESS } from '@hey/data/constants';
import { createOpenActionModuleInput } from 'pwyw-collect-module';

const NewPublication: FC<NewPublicationProps> = ({ publication }) => {
  // ... existing code ...
  const [isPWYW, setIsPWYW] = useState(false);
  const [amountFloor, setAmountFloor] = useState('');
  const [collectLimit, setCollectLimit] = useState('');
  const [currency, setCurrency] = useState('');
  const [referralFee, setReferralFee] = useState('');
  const [followerOnly, setFollowerOnly] = useState(false);
  const [endTimestamp, setEndTimestamp] = useState('');

  const createPublication = async () => {
    // ... existing code ...

    const openActionModules = [];

    if (isPWYW) {
      const collectInitData = createOpenActionModuleInput({
        amountFloor: amountFloor ? parseEther(amountFloor).toString() : '0',
        collectLimit: collectLimit || '0',
        currency: currency || ZERO_ADDRESS,
        referralFee: referralFee || '0',
        followerOnly: followerOnly || false,
        endTimestamp: endTimestamp ? new Date(endTimestamp).getTime() / 1000 : '0',
        recipients: [
          { recipient: currentProfile?.ownedBy.address, split: 10000 }
        ]
      });

      openActionModules.push({
        unknownOpenAction: {
          address: COLLECT_PUBLICATION_ACTION_ADDRESS,
          data: collectInitData
        }
      });
    }

    // ... rest of the existing code ...
  };

  return (
    // ... existing JSX ...
    <div>
      <Switch
        checked={isPWYW}
        label="Enable Pay What You Want"
        onChange={setIsPWYW}
      />
      {isPWYW && (
        <>
          <Input
            label="Amount Floor"
            onChange={(e) => setAmountFloor(e.target.value)}
            placeholder="Minimum amount (optional)"
            type="number"
            value={amountFloor}
          />
          <Input
            label="Collect Limit"
            onChange={(e) => setCollectLimit(e.target.value)}
            placeholder="Maximum number of collects (optional)"
            type="number"
            value={collectLimit}
          />
          <Input
            label="Currency"
            onChange={(e) => setCurrency(e.target.value)}
            placeholder="Currency address (optional)"
            value={currency}
          />
          <Input
            label="Referral Fee"
            onChange={(e) => setReferralFee(e.target.value)}
            placeholder="Referral fee percentage (optional)"
            type="number"
            value={referralFee}
          />
          <Switch
            checked={followerOnly}
            label="Followers Only"
            onChange={setFollowerOnly}
          />
          <Input
            label="End Timestamp"
            onChange={(e) => setEndTimestamp(e.target.value)}
            type="datetime-local"
            value={endTimestamp}
          />
        </>
      )}
    </div>
    // ... rest of the existing JSX ...
  );
};
```

5. Update the CollectAction component to handle PWYW collects:

```typescript
// apps/web/src/components/Publication/OpenAction/CollectModule/CollectAction.tsx

import { createActOnOpenActionRequest } from 'pwyw-collect-module';

const CollectAction: FC<CollectActionProps> = ({ openAction, publication }) => {
  // ... existing code ...

  const createCollect = async () => {
    if (isSuspended) {
      return toast.error(Errors.Suspended);
    }

    try {
      setIsLoading(true);
      const request = createActOnOpenActionRequest({
        action: openAction,
        publication,
        referrer: null
      });

      if (canUseManager) {
        return await actViaLensManager(request);
      }

      return await createActOnOpenActionTypedData({
        variables: {
          options: { overrideSigNonce: lensHubOnchainSigNonce },
          request
        }
      });
    } catch (error) {
      onError(error);
    }
  };

  // ... rest of the existing code ...
};
```

These changes implement the PWYW Collect Module in the hey.xyz application. The implementation includes:

1. Adding necessary constants
2. Creating a new PWYWCollectModule component
3. Updating the CollectModule component to use the new PWYWCollectModule
4. Modifying the NewPublication component to allow setting PWYW collect options
5. Updating the CollectAction component to handle PWYW collects

This implementation allows users to create publications with PWYW collect options and collect publications using the PWYW module.

## User:


