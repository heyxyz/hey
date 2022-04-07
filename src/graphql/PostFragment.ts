import { gql } from '@apollo/client'

import { CollectModuleFragment } from './CollectModuleFragment'
import { PublicationProfileFragment } from './PublicationProfileFragment'

export const PostFragment = gql`
  fragment PostFragment on Post {
    id
    profile {
      ...PublicationProfileFragment
    }
    collectedBy {
      defaultProfile {
        handle
      }
    }
    collectModule {
      ...CollectModuleFragment
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
  ${PublicationProfileFragment}
  ${CollectModuleFragment}
`
