import { gql } from '@apollo/client'

export const GET_ALL_USERS = gql`
  query getAllUsers {
    getAllUsers {
      id
      email
    }
  }
`

export const MYDATA = gql`
  query myData {
    myData {
      id
      email
      firstName
      lastName
      token
      avatar
    }
  }
`