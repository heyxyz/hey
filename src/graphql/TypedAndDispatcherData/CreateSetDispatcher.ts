import { gql } from '@apollo/client';

export const CREATE_SET_DISPATCHER_TYPED_DATA_MUTATION = gql`
  mutation CreateSetDispatcherTypedData($options: TypedDataOptions, $request: SetDispatcherRequest!) {
    createSetDispatcherTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          SetDispatcherWithSig {
            name
            type
          }
        }
        domain {
          name
          chainId
          version
          verifyingContract
        }
        value {
          nonce
          deadline
          profileId
          dispatcher
        }
      }
    }
  }
`;
