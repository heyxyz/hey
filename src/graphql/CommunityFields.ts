import { gql } from '@apollo/client';

import { MetadataFields } from './MetadataFields';

export const CommunityFields = gql`
  fragment CommunityFields on Post {
    id
    hasCollectedByMe
    profile {
      id
    }
    metadata {
      ...MetadataFields
    }
    stats {
      totalAmountOfCollects
      totalAmountOfComments
    }
    createdAt
  }
  ${MetadataFields}
`;
