import { gql } from '@apollo/client'

import { MinimalCollectModuleFields } from './CollectModuleFields'
import { MetadataFields } from './MetadataFields'
import { MinimalProfileFields } from './MinimalProfileFields'
import { StatsFields } from './StatsFields'

export const MirrorFields = gql`
  fragment MirrorFields on Mirror {
    id
    profile {
      name
      handle
    }
    collectModule {
      ...MinimalCollectModuleFields
    }
    stats {
      ...StatsFields
    }
    metadata {
      ...MetadataFields
      cover {
        original {
          url
        }
      }
    }
    mirrorOf {
      ... on Post {
        id
        profile {
          ...MinimalProfileFields
        }
        stats {
          ...StatsFields
        }
      }
      ... on Comment {
        id
        profile {
          ...MinimalProfileFields
        }
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
`
