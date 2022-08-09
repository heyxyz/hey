import { gql } from '@apollo/client';

import { MinimalCollectModuleFields } from './CollectModuleFields';
import { MetadataFields } from './MetadataFields';
import { MinimalProfileFields } from './MinimalProfileFields';
import { StatsFields } from './StatsFields';

export const MirrorFields = gql`
  fragment MirrorFields on Mirror {
    id
    profile {
      name
      handle
    }
    reaction(request: $reactionRequest)
    collectModule {
      ...MinimalCollectModuleFields
    }
    stats {
      ...StatsFields
    }
    metadata {
      ...MetadataFields
    }
    hidden
    mirrorOf {
      ... on Post {
        id
        profile {
          ...MinimalProfileFields
        }
        reaction(request: $reactionRequest)
        stats {
          ...StatsFields
        }
      }
      ... on Comment {
        id
        profile {
          ...MinimalProfileFields
        }
        reaction(request: $reactionRequest)
        stats {
          ...StatsFields
        }
      }
    }
    createdAt
    appId
  }
  ${MinimalProfileFields}
  ${MinimalCollectModuleFields}
  ${MetadataFields}
  ${StatsFields}
`;
