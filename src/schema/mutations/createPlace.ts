import { gql } from '@apollo/client'
import { IFilterPlace } from '../../models/place'

export const CREATE_PLACE = gql`
  mutation createPlace($input: CreatePlaceInput!) {
    createPlace(input: $input) {
      id
      name
      description
      longitude
      latitude
      image
      status
      user{
        id
      }
    }
  }
`

export interface CreatePlaceResponse extends Record<string, any> {
  createPlace: IFilterPlace
}