import { gql } from '@apollo/client'

import { PublicationProfileFragment } from './PublicationProfileFragment'

export const CommentFragment = gql`
  fragment CommentFragment on Comment {
    pubId: id
    profile {
      ...PublicationProfileFragment
    }
    collectedBy {
      address
      defaultProfile {
        handle
      }
    }
    collectModule {
      __typename
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
    }
    commentOn {
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
      ... on Mirror {
        id
        profile {
          handle
        }
      }
    }
    createdAt
  }
  ${PublicationProfileFragment}
`
