import type { FC } from 'react';

import stopEventPropagation from '@hey/helpers/stopEventPropagation';
import { Button, H5, WarningMessage } from '@hey/ui';
import React from 'react';

const permit2Copy = (selectedCurrencySymbol: string) =>
  `Approve ${selectedCurrencySymbol} token allowance to Permit2 contract with transaction.`;

const approveTokenCopy = (selectedCurrencySymbol: string) =>
  `Approve ${selectedCurrencySymbol} token allowance to cross-chain NFT open action contract with signature.`;

interface StepperApprovalsProps {
  approveOA: () => void;
  approvePermit2: () => void;
  isApprovalLoading: boolean;
  isPermit2Loading: boolean;
  nftDetails: {
    creator: string;
    name: string;
    price: string;
    schema: 'ERC-1155' | 'ERC-721';
    uri: string;
  };
  selectedCurrencySymbol: string;
  step: 'Allowance' | 'Permit2';
}

const StepperApprovals: FC<StepperApprovalsProps> = ({
  approveOA,
  approvePermit2,
  isApprovalLoading,
  isPermit2Loading,
  nftDetails,
  selectedCurrencySymbol,
  step
}) => {
  return (
    <div className="w-full space-y-4 p-5">
      <div className="flex w-full items-start justify-between">
        <div className="flex items-center justify-start space-x-4">
          <img
            alt={nftDetails.name}
            className="aspect-[1.5] max-h-[50px] w-auto rounded-xl object-cover"
            src={nftDetails.uri}
          />
          <div>
            <H5>{nftDetails.name}</H5>
            <p className="text-sm">{nftDetails.creator}</p>
          </div>
        </div>
        <div className="ld-text-gray-500 flex items-center space-x-1">
          <b>{nftDetails.price}</b>
          <p>{selectedCurrencySymbol}</p>
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
        <Button
          className="w-full justify-center"
          disabled={isApprovalLoading}
          onClick={(e) => {
            stopEventPropagation(e);
            approveOA();
          }}
          size="lg"
        >
          {isApprovalLoading
            ? 'Approving...'
            : 'Approve Module - Sign in your wallet'}
        </Button>
      ) : (
        <Button
          className="w-full justify-center"
          disabled={isPermit2Loading}
          onClick={(e) => {
            stopEventPropagation(e);
            approvePermit2();
          }}
          size="lg"
        >
          <div>
            {isPermit2Loading
              ? 'Approving...'
              : 'Approve Permit2 - Sign in your wallet'}
          </div>
        </Button>
      )}
    </div>
  );
};

export default StepperApprovals;
