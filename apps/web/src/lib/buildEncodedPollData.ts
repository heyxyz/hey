import { ZERO_ADDRESS } from '@hey/data/constants';
import encodeBytes32String from '@lib/encodeBytes32String';
import { encodeAbiParameters } from 'viem';

const buildEncodedPollData = (pollConfig: {
  length: number;
  options: string[];
}) => {
  const options = [...pollConfig.options];
  while (options.length < 4) {
    options.push('');
  }
  const encodedOptions = options.map(encodeBytes32String);
  const endTimestamp =
    Math.floor(Date.now() / 1000) + pollConfig.length * 24 * 60 * 60;

  return encodeAbiParameters(
    [
      {
        components: [
          { name: 'options', type: 'bytes32[4]' },
          { name: 'followersOnly', type: 'bool' },
          { name: 'endTimestamp', type: 'uint40' },
          { name: 'signatureRequired', type: 'bool' },
          {
            components: [
              { name: 'tokenAddress', type: 'address' },
              { name: 'minThreshold', type: 'uint256' }
            ],
            name: 'gateParams',
            type: 'tuple'
          }
        ],
        name: 'poll',
        type: 'tuple'
      }
    ],
    [
      {
        endTimestamp,
        followersOnly: false,
        gateParams: {
          minThreshold: 0n,
          tokenAddress: ZERO_ADDRESS
        },
        options: encodedOptions as [
          `0x${string}`,
          `0x${string}`,
          `0x${string}`,
          `0x${string}`
        ],
        signatureRequired: false
      }
    ]
  );
};

export default buildEncodedPollData;
