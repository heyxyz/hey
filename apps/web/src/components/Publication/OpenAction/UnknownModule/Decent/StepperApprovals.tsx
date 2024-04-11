import type { FC } from 'react';

import { Button, WarningMessage } from '@hey/ui';
import React from 'react';

// TODO: change copy
const permit2Copy = (selectedCurrencySymbol: string) =>
  `You'll be doing a tx to enable the Permit2 contract for the ${selectedCurrencySymbol} token.`;

// TODO: change copy
const approveTokenCopy = (selectedCurrencySymbol: string) =>
  `You'll be approving the token allowance for the ${selectedCurrencySymbol} token with a signature.`;

type StepperApprovalsProps = {
  approveOA: () => void;
  approvePermit2: () => void;
  nftDetails: {
    creator: string;
    name: string;
    price: string;
    schema: 'ERC-1155' | 'ERC-721';
    uri: string;
  };
  selectedCurrencySymbol: string;
  step: 'Allowance' | 'Permit2';
};

const StepperApprovals: FC<StepperApprovalsProps> = ({
  approveOA,
  approvePermit2,
  nftDetails,
  selectedCurrencySymbol,
  step
}) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 p-4">
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center justify-start gap-4">
          <img
            alt={nftDetails.name}
            className="aspect-[1.5] max-h-[50px] w-auto rounded-xl object-cover"
            src={nftDetails.uri}
          />
          <div className="flex flex-col items-start justify-center">
            <p className="text-lg font-bold">{nftDetails.name}</p>
            <p className="text-sm">{nftDetails.creator}</p>
          </div>
        </div>
        <div className="text-gray-600 dark:text-gray-100">
          {nftDetails.price}
        </div>
      </div>
      <WarningMessage
        message={
          <div>
            <div className="leading-6">
              {step === 'Permit2'
                ? permit2Copy(selectedCurrencySymbol)
                : approveTokenCopy(selectedCurrencySymbol)}
            </div>
            {step === 'Permit2' ? (
              <a
                className="underline"
                href="https://docs.uniswap.org/contracts/permit2/overview"
                rel="noreferrer"
                target="_blank"
              >
                See documentation
              </a>
            ) : null}
          </div>
        }
        title={
          step === 'Permit2'
            ? 'Allowing the Permit2 contract'
            : 'Approving token allowance'
        }
      />

      {step === 'Allowance' ? (
        <Button className="w-full justify-center" onClick={approveOA}>
          Approve
        </Button>
      ) : (
        <Button className="w-full justify-center" onClick={approvePermit2}>
          <div>Approve</div>
        </Button>
      )}
    </div>
  );
};

export default StepperApprovals;
