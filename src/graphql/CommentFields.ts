import { gql } from '@apollo/client'

import { MinimalCollectModuleFields } from './CollectModuleFields'
import { MetadataFields } from './MetadataFields'
import { MinimalProfileFields } from './MinimalProfileFields'
import { StatsFields } from './StatsFields'

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
      ...StatsFields
    }
    metadata {
      ...MetadataFields
    }
    commentOn {
      ... on Post {
        pubId: id
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
          ...StatsFields
        }
        metadata {
          ...MetadataFields
        }
        hidden
        createdAt
      }
      ... on Comment {
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
        metadata {
          ...MetadataFields
        }
        stats {
          ...StatsFields
        }
        mainPost {
          ... on Post {
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
              ...StatsFields
            }
            metadata {
              ...MetadataFields
            }
            hidden
            createdAt
          }
          ... on Mirror {
            id
            profile {
              ...MinimalProfileFields
            }
            collectModule {
              ...MinimalCollectModuleFields
            }
            stats {
              ...StatsFields
            }
            metadata {
              ...MetadataFields
            }
            mirrorOf {
              ... on Post {
                id
                profile {
                  ...MinimalProfileFields
                }
                stats {
                  ...StatsFields
                }
                hidden
              }
              ... on Comment {
                id
                profile {
                  ...MinimalProfileFields
                }
                stats {
                  ...StatsFields
                }
                hidden
              }
            }
            hidden
            createdAt
          }
        }
        hidden
        createdAt
      }
      ... on Mirror {
        id
        profile {
          ...MinimalProfileFields
        }
        metadata {
          ...MetadataFields
        }
        mirrorOf {
          ... on Post {
            id
            profile {
              ...MinimalProfileFields
            }
            stats {
              ...StatsFields
            }
            hidden
          }
          ... on Comment {
            id
            profile {
              ...MinimalProfileFields
            }
            stats {
              ...StatsFields
            }
            hidden
          }
        }
        stats {
          ...StatsFields
        }
        hidden
        createdAt
      }
    }
    hidden
    createdAt
    appId
  }
  ${MinimalProfileFields}
  ${MinimalCollectModuleFields}
  ${MetadataFields}
  ${StatsFields}
`
