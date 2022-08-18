import { gql } from '@apollo/client';

export const CREATE_MIRROR_TYPED_DATA_MUTATION = gql`
  mutation CreateMirrorTypedData($options: TypedDataOptions, $request: CreateMirrorRequest!) {
    createMirrorTypedData(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
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
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`;

export const CREATE_MIRROR_VIA_DISPATHCER_MUTATION = gql`
  mutation CreateMirrorViaDispatcher($options: TypedDataOptions, $request: CreateMirrorRequest!) {
    createMirrorViaDispatcher(options: $options, request: $request) {
      id
      expiresAt
      typedData {
        types {
          MirrorWithSig {
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
          referenceModule
          referenceModuleData
          referenceModuleInitData
        }
      }
    }
  }
`;
