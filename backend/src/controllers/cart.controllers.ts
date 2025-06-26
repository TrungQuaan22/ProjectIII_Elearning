import { Request, Response, NextFunction } from 'express'
import cartService from '~/services/cart.services'
import { AddToCartReqBody, RemoveFromCartReqBody } from '~/models/requests/orders.request'

export const getCartController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user?._id.toString()
    if (!user_id) {
      throw new Error('User not found')
    }

    const cart = await cartService.getCart(user_id)
    res.json({
      message: 'Get cart successfully',
      data: cart
    })
  } catch (error) {
    next(error)
  }
}

export const addToCartController = async (
  req: Request<Record<string, never>, unknown, AddToCartReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?._id.toString()
    if (!user_id) {
      throw new Error('User not found')
    }

    const { course_id } = req.body
    const cart = await cartService.addToCart(user_id, course_id)
    res.json({
      message: 'Add to cart successfully',
      data: cart
    })
  } catch (error) {
    next(error)
  }
}

export const removeFromCartController = async (
  req: Request<Record<string, never>, unknown, RemoveFromCartReqBody>,
  res: Response,
  next: NextFunction
) => {
  try {
    const user_id = req.user?._id.toString()
    if (!user_id) {
      throw new Error('User not found')
    }

    const { course_id } = req.body
    const cart = await cartService.removeFromCart(user_id, course_id)
    res.json({
      message: 'Remove from cart successfully',
      data: cart
    })
  } catch (error) {
    next(error)
  }
}

export const clearCartController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user_id = req.user?._id.toString()
    if (!user_id) {
      throw new Error('User not found')
    }

    const cart = await cartService.clearCart(user_id)
    res.json({
      message: 'Clear cart successfully',
      data: cart
    })
  } catch (error) {
    next(error)
  }
}
