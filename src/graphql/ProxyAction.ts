import { gql } from '@apollo/client';

export const PROXY_ACTION_MUTATION = gql`
  mutation ProxyAction($request: ProxyActionRequest!) {
    proxyAction(request: $request)
  }
`;
