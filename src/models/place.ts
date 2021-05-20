import { IUser } from './user'
import { IUserLikePlace } from './userLikePlace'

export interface IFilterPlace {
  id: string
  name: string
  description: string
  longitude: number
  latitude: number
  status: number
  user: IUser
  user_like_place: IUserLikePlace
  image: string
  createdAt: string
  updatedAt: string
}

export enum TYPE_LOCATION {
  REGION = 0,
  COUNTRY = 1,
  PLACE = 2
}

export enum STATUS {
  PRIVATE = '',
  PUBLIC = 1
}

export const STATUS_NAME = {
  0: 'Private',
  1: 'Public'
}
