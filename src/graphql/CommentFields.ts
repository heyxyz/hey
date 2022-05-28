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
      }
      ... on Comment {
        id
        profile {
          ...MinimalProfileFields
        }
        metadata {
          name
          content
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
        mainPost {
          ... on Post {
            id
            profile {
              ...MinimalProfileFields
            }
            metadata {
              name
              content
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
            createdAt
          }
          ... on Mirror {
            id
            profile {
              ...MinimalProfileFields
            }
            metadata {
              name
              content
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
            createdAt
          }
        }
        createdAt
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
