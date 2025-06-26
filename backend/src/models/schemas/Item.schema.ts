import { ObjectId } from 'mongodb'

export interface Item {
  course_id: ObjectId
  added_at: Date
}

export interface ItemWithPrice extends Item {
  price: number
}
