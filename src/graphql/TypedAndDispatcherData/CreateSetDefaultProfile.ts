import { gql } from '@apollo/client';
import { RelayerResultFields } from '@gql/RelayerResultFields';

export const CREATE_SET_DEFAULT_PROFILE_DATA_MUTATION = gql`
  mutation CreateSetDefaultProfileTypedData(
    $options: TypedDataOptions
    $request: CreateSetDefaultProfileRequest!
  ) {
    createSetDefaultProfileTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        domain {
          name
          chainId
          version
          verifyingContract
        }
        types {
          SetDefaultProfileWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          wallet
          profileId
        }
      }
    }
  }
`;

export const CREATE_SET_DEFAULT_PROFILE_VIA_DISPATHCER_MUTATION = gql`
  mutation CreateSetDefaultProfileViaDispatcher($request: CreateSetDefaultProfileRequest!) {
    createSetDefaultProfileViaDispatcher(request: $request) {
      ...RelayerResultFields
    }
  }
  ${RelayerResultFields}
`;
