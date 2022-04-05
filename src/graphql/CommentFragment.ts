import { gql } from '@apollo/client'

import { CommentCollectionFragment } from './CollectionFragment'
import { PublicationProfileFragment } from './PublicationProfileFragment'

export const CommentFragment = gql`
  fragment CommentFragment on Comment {
    id
    profile {
      ...PublicationProfileFragment
    }
    collectedBy {
      address
      defaultProfile {
        handle
      }
    }
    ...CommentCollectionFragment
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
      attributes {
        value
      }
    }
    commentOn {
      ... on Post {
        id
        profile {
          name
          handle
          ownedBy
          picture {
            ... on MediaSet {
              original {
                url
              }
            }
          }
        }
        metadata {
          content
        }
      }
      ... on Comment {
        id
        profile {
          name
          handle
          ownedBy
          picture {
            ... on MediaSet {
              original {
                url
              }
            }
          }
        }
        metadata {
          content
        }
      }
      ... on Mirror {
        id
        profile {
          name
          handle
          ownedBy
          picture {
            ... on MediaSet {
              original {
                url
              }
            }
          }
        }
        metadata {
          content
        }
      }
    }
    createdAt
    appId
  }
  ${PublicationProfileFragment}
  ${CommentCollectionFragment}
`
