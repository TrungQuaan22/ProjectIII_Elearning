import { ObjectId } from 'mongodb'

export interface CartDetail {
  course_id: ObjectId
  added_at: Date
  course: {
    title: string
    thumbnail: string
    price: number
  }
}

export interface CartResponse {
  message: string
  data: CartDetail[]
}
