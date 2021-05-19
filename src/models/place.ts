export interface IFilterPlace {
  id: string
  name: string
  description: string
  longitude: number
  latitude: number
  image: string
  createdAt: string
  updatedAt: string
}

export enum TYPE_LOCATION {
  REGION = 0,
  COUNTRY = 1,
  PLACE = 2
}
