import { getCourseEnrollments } from "src/apis/courses.api"
import { useAppContext } from "./useAppContext"
import { useQuery } from "@tanstack/react-query"

export const useEnrollments = () => {
  const { isAuthenticated } = useAppContext()

  return useQuery({
    queryKey: ['enrollments'],
    queryFn: () => getCourseEnrollments(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}