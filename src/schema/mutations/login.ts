import { gql } from '@apollo/client'


export const LOGIN_REQUEST = gql`
  mutation login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
      }
    }
  }
`

export interface LoginResponse extends Record<string, any> {
  login: { token: string; user: { id: string; email: string } }
}
