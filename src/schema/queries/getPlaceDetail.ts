import { gql } from '@apollo/client'

export const GET_DETAIL_PLACE = gql`
  query getDetailPlace($id: ID!) {
    getDetailPlace(id: $id) {
      id
      name
      description
      longitude
      latitude
      image
      status
      userId
    }
  }
`
