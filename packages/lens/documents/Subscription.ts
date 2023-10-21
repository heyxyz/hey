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
      ... on ReactionNotification {
        id
      }
      ... on CommentNotification {
        id
      }
      ... on MirrorNotification {
        id
      }
      ... on QuoteNotification {
        id
      }
      ... on ActedNotification {
        id
      }
      ... on FollowNotification {
        id
      }
      ... on MentionNotification {
        id
      }
    }
  }
`;
