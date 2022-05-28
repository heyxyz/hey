import { gql } from '@apollo/client'

import { MinimalCollectModuleFields } from './CollectModuleFields'
import { MinimalProfileFields } from './MinimalProfileFields'

export const CommentFields = gql`
  fragment CommentFields on Comment {
    id
    profile {
      ...MinimalProfileFields
    }
    collectedBy {
      address
      defaultProfile {
        handle
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
        pubId: id
        profile {
          ...MinimalProfileFields
        }
        metadata {
          name
          content
        }
      }
      ... on Comment {
        id
        profile {
          ...MinimalProfileFields
        }
        metadata {
          name
          content
        }
        mainPost {
          ... on Post {
            id
            profile {
              ...MinimalProfileFields
            }
            metadata {
              name
              content
            }
          }
          ... on Mirror {
            id
            profile {
              ...MinimalProfileFields
            }
            metadata {
              name
              content
            }
          }
        }
      }
      ... on Mirror {
        id
        profile {
          ...MinimalProfileFields
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
  ${MinimalProfileFields}
  ${MinimalCollectModuleFields}
`
