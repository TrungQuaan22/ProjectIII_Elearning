import databaseService from '../services/database.services'
import Category from '../models/schemas/Category.schema'

async function main() {
  await databaseService.connect()
  // 1. Tìm hoặc tạo category mặc định
  let category = await databaseService.categories.findOne({ name: 'Chưa phân loại' })
  if (!category) {
    category = new Category({
      name: 'Chưa phân loại',
      image: 'https://placehold.co/600x400?text=Uncategorized',
      description: 'Các bài viết chưa được phân loại'
    })
    await databaseService.categories.insertOne(category)
    console.log('Đã tạo category mặc định:', category)
  } else {
    console.log('Đã có category mặc định:', category)
  }
  // 2. Update các blog chưa có category_id
  const result = await databaseService.blogs.updateMany(
    { category_id: { $exists: false } },
    { $set: { category_id: category._id } }
  )
  console.log(`Đã cập nhật ${result.modifiedCount} blog về category mặc định.`)
  process.exit(0)
}

main()
