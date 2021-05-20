import { gql } from '@apollo/client'

export const USER_LIKE_PLACE = gql`
  mutation userLike($placeId: String, $userId: String) {
    userLike(placeId: $placeId, userId: $userId) {
      id
      placeId
      userId
    }
  }
`

export interface createUserLikePlaceResponse extends Record<string, any> {
  userLike: { id: string, placeId: string, userId: string }
}