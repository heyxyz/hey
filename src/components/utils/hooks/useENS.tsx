import { useState } from 'react'
import { useContractRead } from 'wagmi'

export const useENS = (
  address: string
): { data: string | null; isLoading: boolean } => {
  const [ensName, setENSName] = useState<string | null>(null)

  const abi = [
    {
      inputs: [
        { internalType: 'address[]', name: 'addresses', type: 'address[]' }
      ],
      name: 'getNames',
      outputs: [{ internalType: 'string[]', name: 'r', type: 'string[]' }],
      stateMutability: 'view',
      type: 'function'
    }
  ]

  const { data, isLoading } = useContractRead(
    {
      addressOrName: '0x3671ae578e63fdf66ad4f3e12cc0c0d71ac7510c',
      contractInterface: abi
    },
    'getNames',
    { args: [[address]], chainId: 1 }
  )

  return { data: data ? data[0] : null, isLoading }
}
