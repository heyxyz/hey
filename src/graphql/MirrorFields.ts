import { gql } from '@apollo/client'

import { MinimalProfileFields } from './MinimalProfileFields'

export const MirrorFields = gql`
  fragment MirrorFields on Mirror {
    id
    profile {
      ...MinimalProfileFields
    }
    stats {
      totalAmountOfComments
      totalAmountOfMirrors
      totalAmountOfCollects
    }
    metadata {
      content
      description
      media {
        original {
          url
          mimeType
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
          handle
        }
      }
      ... on Comment {
        id
        profile {
          handle
        }
      }
    }
    createdAt
    appId
  }
  ${MinimalProfileFields}
`
