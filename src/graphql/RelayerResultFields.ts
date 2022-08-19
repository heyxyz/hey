import { gql } from '@apollo/client';

export const RelayerResultFields = gql`
  fragment RelayerResultFields on RelayResult {
    ... on RelayerResult {
      txHash
    }
    ... on RelayError {
      reason
    }
  }
`;
