import { gql } from '@apollo/client';
import { RelayerResultFields } from '@gql/RelayerResultFields';

export const CREATE_COMMENT_TYPED_DATA_MUTATION = gql`
  mutation CreateCommentTypedData($options: TypedDataOptions, $request: CreatePublicCommentRequest!) {
    createCommentTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          CommentWithSig {
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
          profileIdPointed
          pubIdPointed
          contentURI
          collectModule
          collectModuleInitData
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`;

export const CREATE_COMMENT_VIA_DISPATHCER_MUTATION = gql`
  mutation CreateCommentViaDispatcher($request: CreatePublicCommentRequest!) {
    createCommentViaDispatcher(request: $request) {
      ...RelayerResultFields
    }
  }
  ${RelayerResultFields}
`;
