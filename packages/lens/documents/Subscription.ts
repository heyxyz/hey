export const UserSigNoncesSubscription = `
  subscription UserSigNonces($address: EvmAddress!) {
    userSigNonces(address: $address) {
      lensHubOnchainSigNonce
      lensTokenHandleRegistryOnchainSigNonce
      lensPublicActProxyOnchainSigNonce
    }
  }
`;

export const NewNotificationSubscription = `
  subscription NewNotification($for: ProfileId!) {
    newNotification(for: $for) {
      __typename
      ... on ReactionNotification {
        id
        reactions {
          profile {
            ...ProfileFields
          }
        }
        publication {
          __typename
        }
      }
      ... on CommentNotification {
        id
        comment {
          by {
            ...ProfileFields
          }
          commentOn {
            __typename
          }
        }
      }
      ... on MirrorNotification {
        id
        mirrors {
          profile {
            ...ProfileFields
          }
        }
        publication {
          __typename
        }
      }
      ... on QuoteNotification {
        id
        quote {
          by {
            ...ProfileFields
          }
          quoteOn {
            __typename
          }
        }
      }
      ... on ActedNotification {
        id
        actions {
          by {
            ...ProfileFields
          }
        }
        publication {
          __typename
        }
      }
      ... on FollowNotification {
        id
        followers {
          ...ProfileFields
        }
      }
      ... on MentionNotification {
        id
        publication {
          __typename
          ... on Post {
            by {
              ...ProfileFields
            }
          }
          ... on Comment {
            by {
              ...ProfileFields
            }
          }
          ... on Quote {
            by {
              ...ProfileFields
            }
          }
        }
      }
    }
  }
  fragment ProfileFields on Profile {
    id
    handle {
      suggestedFormatted {
        localName
      }
    }
  }
`;

export const AuthorizationRecordRevokedSubscription = `
  subscription AuthorizationRecordRevoked($authorizationId: UUID!) {
    authorizationRecordRevoked(authorizationId: $authorizationId)
  }
`;
