import { gql } from '@apollo/client'

import { CollectModuleFields } from './CollectModuleFields'
import { PublicationProfileFields } from './PublicationProfileFields'

export const PostFields = gql`
  fragment PostFields on Post {
    id
    profile {
      ...PublicationProfileFields
    }
    collectedBy {
      defaultProfile {
        handle
      }
    }
    collectModule {
      ...CollectModuleFields
    }
    stats {
      totalAmountOfComments
      totalAmountOfMirrors
      totalAmountOfCollects
    }
    metadata {
      name
      description
      content
      description
      media {
        original {
          url
          mimeType
        }
      }
      cover {
        original {
          url
        }
      }
      attributes {
        value
      }
    }
    createdAt
    appId
  }
  ${PublicationProfileFields}
  ${CollectModuleFields}
`
