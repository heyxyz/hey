import { gql } from '@apollo/client';
import { RelayerResultFields } from '@gql/RelayerResultFields';

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
  mutation CreateMirrorViaDispatcher($request: CreateMirrorRequest!) {
    createMirrorViaDispatcher(request: $request) {
      ...RelayerResultFields
    }
  }
  ${RelayerResultFields}
`;
