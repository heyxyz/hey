import { gql } from '@apollo/client';

import { MinimalCollectModuleFields } from './CollectModuleFields';
import { MetadataFields } from './MetadataFields';
import { MinimalProfileFields } from './MinimalProfileFields';
import { PostFields } from './PostFields';
import { StatsFields } from './StatsFields';

export const MirrorFields = gql`
  fragment MirrorFields on Mirror {
    id
    profile {
      ...MinimalProfileFields
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
        ...PostFields
      }
      ... on Comment {
        id
        profile {
          ...MinimalProfileFields
        }
        reaction(request: $reactionRequest)
        mirrors(by: $profileId)
        stats {
          ...StatsFields
        }
        createdAt
      }
    }
    createdAt
    appId
  }
  ${MinimalProfileFields}
  ${PostFields}
  ${MinimalCollectModuleFields}
  ${MetadataFields}
  ${StatsFields}
`;
