import { gql } from '@apollo/client';

import { MinimalCollectModuleFields } from './CollectModuleFields';
import { MetadataFields } from './MetadataFields';
import { ProfileFields } from './ProfileFields';
import { StatsFields } from './StatsFields';

export const PostFields = gql`
  fragment PostFields on Post {
    id
    profile {
      ...ProfileFields
    }
    reaction(request: $reactionRequest)
    mirrors(by: $profileId)
    canComment(profileId: $profileId) {
      result
    }
    canMirror(profileId: $profileId) {
      result
    }
    hasCollectedByMe
    collectedBy {
      address
      defaultProfile {
        ...ProfileFields
      }
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
    createdAt
    appId
  }
  ${ProfileFields}
  ${MinimalCollectModuleFields}
  ${MetadataFields}
  ${StatsFields}
`;
