import { ObjectId } from 'mongodb'

export interface AddToCartReqBody {
  course_id: string
}

export interface RemoveFromCartReqBody {
  course_id: string
}
