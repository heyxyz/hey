import { gql } from '@apollo/client'

export const BROADCAST_MUTATION = gql`
  mutation Broadcast($request: BroadcastRequest!) {
    broadcast(request: $request) {
      ... on RelayerResult {
        txHashd
      }
      ... on RelayError {
        reason
      }
    }
  }
`
