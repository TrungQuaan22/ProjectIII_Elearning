import { Badge, Box, Card, HStack, Image } from '@chakra-ui/react'
import { BlogType } from 'src/types/blog.type'
import { useNavigate } from 'react-router-dom'

export const BlogCard = ({ blog }: { blog: BlogType }) => {
  const navigate = useNavigate()
  return (
  <Card.Root flexDirection='row' overflow='hidden' maxW='80%' className='w-full'>
    <Image
      objectFit='cover'
      maxW='200px'
      src={
        blog.thumbnail ||
        'https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60'
      }
      alt={blog.title}
    />
    <Box>
      <Card.Body>
        <Card.Title mb='2'>{blog.title}</Card.Title>
        <Card.Description>{blog.summary || ''}</Card.Description>
        <HStack mt='4'>
          {blog.tags?.map((tag) => <Badge key={tag}>{tag}</Badge>)}
          {blog.category?.name && <Badge colorScheme='blue'>{blog.category.name}</Badge>}
        </HStack>
      </Card.Body>
      <Card.Footer>
        <button onClick={() => navigate(`/blogs/${blog.slug}`)} className='bg-slate-900 text-white p-2 rounded-md w-32 hover:bg-slate-800'>
          Đọc thêm
        </button>
      </Card.Footer>
      </Box>
    </Card.Root>
  )
}
