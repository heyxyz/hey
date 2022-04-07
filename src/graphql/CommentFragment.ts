import { gql } from '@apollo/client'

import { CollectModuleFragment } from './CollectModuleFragment'
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
          name
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
          name
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
          name
          content
        }
      }
    }
    createdAt
    appId
  }
  ${PublicationProfileFragment}
  ${CollectModuleFragment}
`
