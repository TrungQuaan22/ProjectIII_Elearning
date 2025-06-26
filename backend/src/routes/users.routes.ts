import { Router } from 'express'
import { getMeController, loginController, registerController, logoutController } from '~/controllers/users.controllers'
import { loginValidator, registerValidator, accessTokenValidator } from '~/middlewares/users.middlewares'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, loginController)
usersRouter.post('/register', registerValidator, registerController)
usersRouter.get('/me', accessTokenValidator, getMeController)
usersRouter.post('/logout', accessTokenValidator, logoutController)

export default usersRouter
