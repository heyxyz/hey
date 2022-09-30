import { gql } from '@apollo/client';

export const TX_STATUS_QUERY = gql`
  query HasTxHashBeenIndexed($request: HasTxHashBeenIndexedRequest!) {
    hasTxHashBeenIndexed(request: $request) {
      ... on TransactionIndexedResult {
        metadataStatus {
          status
        }
        indexed
      }
      ... on TransactionError {
        reason
      }
    }
  }
`;
