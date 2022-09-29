import { gql } from '@apollo/client';

import { MinimalCollectModuleFields } from './CollectModuleFields';
import { MetadataFields } from './MetadataFields';
import { PostFields } from './PostFields';
import { ProfileFields } from './ProfileFields';
import { StatsFields } from './StatsFields';

export const MirrorFields = gql`
  fragment MirrorFields on Mirror {
    id
    profile {
      ...ProfileFields
    }
    reaction(request: $reactionRequest)
    canMirror(profileId: $profileId) {
      result
    }
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
          ...ProfileFields
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
  ${PostFields}
  ${ProfileFields}
  ${MinimalCollectModuleFields}
  ${MetadataFields}
  ${StatsFields}
`;
