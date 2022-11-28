export const FeeCollector = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: '_from',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_amount',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'string',
        name: '_userId',
        type: 'string'
      }
    ],
    name: 'PaidForLensterPro',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'string',
        name: 'userId',
        type: 'string'
      }
    ],
    name: 'payForLensterPro',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  }
];
