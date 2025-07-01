import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getBlogsWithParams } from 'src/apis/blogs.api'
import { getCategories } from 'src/apis/categories.api'
import { BlogCard } from 'src/components/BlogCard/BlogCard'
import { useDebounce } from 'src/hooks/useDebounce'

export default function BlogsListUser() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [page, setPage] = useState(1)
  const limit = 9
  const debouncedSearch = useDebounce(search, 400)

  // Fetch categories
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories
  })

  // Fetch blogs
  const { data: blogsData, isLoading } = useQuery({
    queryKey: ['blogs', { page, limit, search: debouncedSearch, category: selectedCategory }],
    queryFn: () => getBlogsWithParams({ page, limit, search: debouncedSearch, category: selectedCategory })
  })

  const blogs = blogsData?.blogs || []
  const totalPages = blogsData?.pagination?.total_pages || 1

  return (
    <div className='max-w-7xl mx-auto px-4 py-8 flex gap-8'>
      {/* Sidebar: Category filter */}
      <aside className='w-64 hidden md:block'>
        <div className='bg-white rounded-lg shadow p-4 mb-6'>
          <h2 className='text-lg font-bold mb-4'>Danh mục</h2>
          <ul className='space-y-2'>
            <li>
              <button
                className={`w-full text-left px-3 py-2 rounded ${!selectedCategory ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'}`}
                onClick={() => setSelectedCategory('')}
              >
                Tất cả
              </button>
            </li>
            {categories.map((cat) => (
              <li key={cat._id}>
                <button
                  className={`w-full text-left px-3 py-2 rounded ${selectedCategory === cat.slug ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'}`}
                  onClick={() => setSelectedCategory(cat.slug || '')}
                >
                  {cat.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>
      {/* Main content */}
      <main className='flex-1'>
        {/* Search bar */}
        <div className='mb-6'>
          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Tìm kiếm blog theo tên...'
            className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          />
        </div>
        {/* Blog grid */}
        {isLoading ? (
          <div className='flex justify-center py-12'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500'></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className='text-center py-12 text-gray-500'>Không có blog nào phù hợp</div>
        ) : (
          <div className='grid grid-cols-1 gap-8'>
            {blogs.map((blog) => (
              <BlogCard key={blog._id || blog.id} blog={blog} />
            ))}
          </div>
        )}
        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center mt-8 gap-2'>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className='px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
            >
              Trước
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-2 rounded ${p === page ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className='px-3 py-2 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50'
            >
              Sau
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
