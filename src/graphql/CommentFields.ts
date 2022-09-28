import { gql } from '@apollo/client';

import { MinimalCollectModuleFields } from './CollectModuleFields';
import { MetadataFields } from './MetadataFields';
import { MirrorFields } from './MirrorFields';
import { PostFields } from './PostFields';
import { ProfileFields } from './ProfileFields';
import { StatsFields } from './StatsFields';

export const CommentFields = gql`
  fragment CommentFields on Comment {
    id
    profile {
      ...ProfileFields
    }
    reaction(request: $reactionRequest)
    mirrors(by: $profileId)
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
    commentOn {
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
        hasCollectedByMe
        collectedBy {
          address
          defaultProfile {
            handle
          }
        }
        collectModule {
          ...MinimalCollectModuleFields
        }
        metadata {
          ...MetadataFields
        }
        stats {
          ...StatsFields
        }
        mainPost {
          ... on Post {
            ...PostFields
          }
          ... on Mirror {
            ...MirrorFields
          }
        }
        hidden
        createdAt
      }
      ... on Mirror {
        ...MirrorFields
      }
    }
  }
  ${PostFields}
  ${MirrorFields}
  ${ProfileFields}
  ${MinimalCollectModuleFields}
  ${MetadataFields}
  ${StatsFields}
`;
