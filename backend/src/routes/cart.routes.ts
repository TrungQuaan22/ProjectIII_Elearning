import { Router } from 'express'
import {
  addToCartController,
  removeFromCartController,
  getCartController,
  clearCartController
} from '~/controllers/cart.controllers'
import {
  addToCartValidator,
  removeFromCartValidator,
  checkCourseInCart,
  checkEnrolledCourse
} from '~/middlewares/cart.middlewares'
import { accessTokenValidator } from '~/middlewares/users.middlewares'

const cartRouter = Router()

// Add to cart
cartRouter.post(
  '/add',
  accessTokenValidator,
  addToCartValidator,
  checkCourseInCart,
  checkEnrolledCourse,
  addToCartController
)

// Remove from cart
cartRouter.post('/remove', accessTokenValidator, removeFromCartValidator, removeFromCartController)

// Get cart
cartRouter.get('/', accessTokenValidator, getCartController)

//Clear cart
cartRouter.delete('/clear', accessTokenValidator, clearCartController)

export default cartRouter
