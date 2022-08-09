import { gql } from '@apollo/client';

export const StatsFields = gql`
  fragment StatsFields on PublicationStats {
    totalUpvotes
    totalAmountOfMirrors
    totalAmountOfCollects
    totalAmountOfComments
  }
`;
