import { MongoClient, Db, Collection } from 'mongodb'
import { config } from 'dotenv'
import User from '~/models/schemas/User.schema'
import Course from '~/models/schemas/Course.schema'
import Order from '~/models/schemas/Order.schema'
import Enrollment from '~/models/schemas/Enrollment.schema'
import Blog from '~/models/schemas/Blog.schema'
import Category from '../models/schemas/Category.schema'

config()

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASSWORD as string)}@quanedu.qn1wa32.mongodb.net/?retryWrites=true&w=majority&appName=QuanEdu`

class DatabaseService {
  private client: MongoClient
  private db: Db

  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(process.env.DB_NAME)
  }

  async connect() {
    try {
      await this.client.connect()
      console.log('Pinged your deployment. You successfully connected to MongoDB!')
    } catch (error) {
      console.error('Error connecting to MongoDB:', error)
      throw error
    }
  }

  get users(): Collection<User> {
    return this.db.collection<User>('users')
  }

  get blogs(): Collection<Blog> {
    return this.db.collection<Blog>('blogs')
  }

  get courses(): Collection<Course> {
    return this.db.collection<Course>('courses')
  }

  get orders(): Collection<Order> {
    return this.db.collection<Order>('orders')
  }

  get enrollments(): Collection<Enrollment> {
    return this.db.collection<Enrollment>('enrollments')
  }

  get categories() {
    return this.db.collection('categories')
  }
}

const databaseService = new DatabaseService()
export default databaseService
