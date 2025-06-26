import http from 'src/utils/http'
import type { CategoryType } from 'src/types/category.type'

export const getCategories = async (): Promise<CategoryType[]> => {
  const res = await http.get<CategoryType[]>('/categories')
  return res.data
}
