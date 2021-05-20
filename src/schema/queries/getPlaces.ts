import { gql } from '@apollo/client'

export const GET_ALL_PLACES = gql`
  query getAllPlaces($input: FilterPlaceInput!) {
    getAllPlaces(input: $input) {
      id
      name
      description
      longitude
      latitude
      image
      status
      user {
        id
        email
        firstName
        lastName
        token
        avatar
      }
      user_like_place {
        id
        placeId
        userId
      }
      createdAt
      updatedAt
    }
  }
`
