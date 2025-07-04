import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'

export const validate = (validations: ValidationChain[]) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction): Promise<void> => {
    await Promise.all(validations.map((validation) => validation.run(req)))

    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.mapped() })
      return
    }

    next()
  }
}
