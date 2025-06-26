export interface CartItem {
  course_id: string
  added_at: string
  course: {
    title: string
    thumbnail: string
    price: number
  }
}

export interface CartResponse {
  message: string
  data: CartItem[]
}
