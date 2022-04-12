import { gql } from '@apollo/client'

import { MinimalCollectModuleFields } from './CollectModuleFields'
import { MinimalProfileFields } from './MinimalProfileFields'

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
    mirrorOf {
      ... on Post {
        id
        profile {
          ...MinimalProfileFields
        }
      }
      ... on Comment {
        id
        profile {
          ...MinimalProfileFields
        }
      }
    }
    createdAt
    appId
  }
  ${MinimalProfileFields}
  ${MinimalCollectModuleFields}
`
