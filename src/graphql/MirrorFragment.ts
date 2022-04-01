import { gql } from '@apollo/client'

import { PublicationProfileFragment } from './PublicationProfileFragment'

export const MirrorFragment = gql`
  fragment MirrorFragment on Mirror {
    id
    profile {
      ...PublicationProfileFragment
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
  ${PublicationProfileFragment}
`
