import { gql } from '@apollo/client';
import { RelayerResultFields } from '@gql/RelayerResultFields';

export const CREATE_SET_PROFILE_IMAGE_URI_TYPED_DATA_MUTATION = gql`
  mutation CreateSetProfileImageURITypedData(
    $options: TypedDataOptions
    $request: UpdateProfileImageRequest!
  ) {
    createSetProfileImageURITypedData(options: $options, request: $request) {
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
          SetProfileImageURIWithSig {
            name
            type
          }
        }
        value {
          nonce
          deadline
          imageURI
          profileId
        }
      }
    }
  }
`;

export const CREATE_SET_PROFILE_IMAGE_URI_VIA_DISPATHCER_MUTATION = gql`
  mutation CreateSetProfileImageURIViaDispatcher($request: UpdateProfileImageRequest!) {
    createSetProfileImageURIViaDispatcher(request: $request) {
      ...RelayerResultFields
    }
  }
  ${RelayerResultFields}
`;
