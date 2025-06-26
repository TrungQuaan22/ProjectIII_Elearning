# Toast Error Implementation for React Query

## Overview

Đã thêm toast error notifications cho tất cả các API calls sử dụng React Query để cải thiện trải nghiệm người dùng khi có lỗi xảy ra.

## Implementation Details

### 1. Authentication APIs

**File**: `src/hooks/useAuth.ts`

- ✅ `useLogin()` - Đã có toast error
- ✅ `useRegister()` - Đã có toast error
- ✅ `useLogout()` - Đã có toast error
- ✅ `useGetProfile()` - Đã thêm toast error

### 2. Course Management APIs

**File**: `src/components/DashBoard/CourseForm.tsx`

- ✅ `createCourse` mutation - Đã thêm toast error
- ✅ `updateCourse` mutation - Đã thêm toast error

**File**: `src/components/DashBoard/CurriculumBuilder.tsx`

- ✅ `createTopic` mutation - Đã thêm toast error
- ✅ `updateTopic` mutation - Đã thêm toast error
- ✅ `deleteTopic` mutation - Đã thêm toast error
- ✅ `createLesson` mutation - Đã thêm toast error
- ✅ `updateLesson` mutation - Đã thêm toast error
- ✅ `deleteLesson` mutation - Đã thêm toast error

### 3. Course Display APIs

**File**: `src/pages/CourseDetail/CourseDetail.tsx`

- ✅ `getCourseDetail` query - Đã thêm toast error
- ✅ `addToCart` mutation - Đã có toast error

**File**: `src/pages/ListCourses/ListCourses.tsx`

- ✅ `getAllCourses` query - Đã thêm toast error

**File**: `src/pages/Enrollments/Enrollments.tsx`

- ✅ `getAllCoursesByAdmin` query - Đã thêm toast error

**File**: `src/pages/LearnCourse/LearnCourse.tsx`

- ✅ `getCourseEnrollmentDetail` query - Đã thêm toast error

### 4. Admin Dashboard APIs

**File**: `src/pages/DashBoard/CoursesList.tsx`

- ✅ `getAllCoursesByAdmin` query - Đã thêm toast error

**File**: `src/pages/DashBoard/CourseEditPage.tsx`

- ✅ `getCourseDetailByAdmin` query - Đã thêm toast error

### 5. Cart APIs

**File**: `src/pages/Cart/Cart.tsx`

- ✅ `getCart` query - Đã thêm toast error
- ✅ `removeFromCart` mutation - Đã có toast error

## Error Handling Pattern

### For useQuery (Data Fetching)

```typescript
const { data, error } = useQuery({
  queryKey: ['key'],
  queryFn: () => apiCall()
  // ... other options
})

useEffect(() => {
  if (error) {
    console.error('API error:', error)
    toast.error('Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại!')
  }
}, [error])
```

### For useMutation (Data Modifying)

```typescript
const mutation = useMutation({
  mutationFn: (data) => apiCall(data),
  onSuccess: () => {
    toast.success('Thao tác thành công!')
    // ... other success logic
  },
  onError: (error: Error) => {
    console.error('Mutation error:', error)
    toast.error('Có lỗi xảy ra. Vui lòng thử lại!')
  }
})
```

## Toast Configuration

**File**: `src/App.tsx`

```typescript
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      {/* ... other components */}
      <ToastContainer autoClose={1000} />
    </>
  )
}
```

## Benefits

1. **User Experience**: Người dùng được thông báo ngay lập tức khi có lỗi
2. **Debugging**: Console.error logs giúp developers debug dễ dàng hơn
3. **Consistency**: Tất cả API calls đều có error handling thống nhất
4. **Accessibility**: Toast notifications dễ nhìn và dễ hiểu

## Error Messages

Tất cả error messages đều được viết bằng tiếng Việt và có format thống nhất:

- **Success**: "Thao tác thành công!"
- **Error**: "Có lỗi xảy ra khi [action]. Vui lòng thử lại!"

## Future Improvements

1. **Error Categorization**: Phân loại lỗi theo mức độ nghiêm trọng
2. **Retry Mechanism**: Cho phép người dùng retry khi có lỗi network
3. **Error Analytics**: Track lỗi để cải thiện hệ thống
4. **Custom Error Messages**: Hiển thị message cụ thể từ server response
