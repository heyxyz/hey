import { gql } from '@apollo/client'

import { MinimalCollectModuleFields } from './CollectModuleFields'
import { MetadataFields } from './MetadataFields'
import { MinimalProfileFields } from './MinimalProfileFields'

export const PostFields = gql`
  fragment PostFields on Post {
    id
    profile {
      ...MinimalProfileFields
    }
    collectedBy {
      address
      defaultProfile {
        ...MinimalProfileFields
      }
    }
    collectModule {
      ...MinimalCollectModuleFields
    }
    stats {
      totalAmountOfComments
      totalAmountOfMirrors
      totalAmountOfCollects
    }
    metadata {
      ...MetadataFields
      cover {
        original {
          url
        }
      }
    }
    createdAt
    appId
  }
  ${MinimalProfileFields}
  ${MinimalCollectModuleFields}
  ${MetadataFields}
`
