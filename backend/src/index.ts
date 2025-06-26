import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import { config } from 'dotenv'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import usersRouter from './routes/users.routes'
import coursesRouter from './routes/courses.routes'
import userCoursesRouter from './routes/user-courses.routes'
import ordersRouter from './routes/orders.routes'
import databaseService from './services/database.services'
import cartRouter from './routes/cart.routes'
import blogsRouter from './routes/blogs.routes'
import categoryRoutes from './routes/category.routes'

config()

const app = express()

// Middlewares
app.use(helmet())
app.use(cors())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes

app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/courses', coursesRouter)
app.use('/api/user-courses', userCoursesRouter)
app.use('/api/orders', ordersRouter)
app.use('/api/cart', cartRouter)
app.use('/api', categoryRoutes)

// Error handling
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  defaultErrorHandler(err, req, res, next)
})
// app.use(defaultErrorHandler)

const PORT = process.env.PORT || 4000

// Connect to database
databaseService
  .connect()
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error)
    process.exit(1)
  })
