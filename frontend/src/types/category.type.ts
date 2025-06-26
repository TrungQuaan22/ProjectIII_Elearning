export interface CategoryType {
  _id?: string
  name: string // bắt buộc
  image: string // bắt buộc
  slug?: string
  description?: string
  created_at?: Date
  updated_at?: Date
}
