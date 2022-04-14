import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from '@apollo/client'
import result from '@generated/types'
import consoleLog from '@lib/consoleLog'
import jwtDecode from 'jwt-decode'

import { API_URL, ERROR_MESSAGE } from './constants'

const REFRESH_AUTHENTICATION_MUTATION = `
  mutation Refresh($request: RefreshRequest!) {
    refresh(request: $request) {
      accessToken
      refreshToken
    }
  }
`

const httpLink = new HttpLink({
  uri: API_URL,
  fetch
})

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.accessToken

  if (token === 'undefined') {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('selectedProfile')

    return forward(operation)
  } else {
    operation.setContext({
      headers: {
        'x-access-token': token ? `Bearer ${token}` : ''
      }
    })

    // @ts-ignore
    const { exp }: { exp: any } = token ? jwtDecode(token) : ''

    if (Date.now() >= exp * 1000) {
      consoleLog('Auth', '#eab308', 'Generate new access token')
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operationName: 'Refresh',
          query: REFRESH_AUTHENTICATION_MUTATION,
          variables: {
            request: { refreshToken: localStorage.refreshToken }
          }
        })
      })
        .then((res) => res.json())
        .then((res) => {
          operation.setContext({
            headers: {
              'x-access-token': token
                ? `Bearer ${res?.data?.refresh?.accessToken}`
                : ''
            }
          })
          localStorage.setItem('accessToken', res?.data?.refresh?.accessToken)
          localStorage.setItem('refreshToken', res?.data?.refresh?.refreshToken)
        })
        .catch(() => console.log(ERROR_MESSAGE))
    }

    return forward(operation)
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({ possibleTypes: result.possibleTypes })
})

export default client
