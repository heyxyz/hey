import { gql } from '@apollo/client';
import { RelayerResultFields } from '@gql/RelayerResultFields';

export const CREATE_POST_TYPED_DATA_MUTATION = gql`
  mutation CreatePostTypedData($options: TypedDataOptions, $request: CreatePublicPostRequest!) {
    createPostTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          PostWithSig {
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
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleInitData
        }
      }
    }
  }
`;

export const CREATE_POST_VIA_DISPATHCER_MUTATION = gql`
  mutation CreatePostViaDispatcher($request: CreatePublicPostRequest!) {
    createPostViaDispatcher(request: $request) {
      ...RelayerResultFields
    }
  }
  ${RelayerResultFields}
`;
