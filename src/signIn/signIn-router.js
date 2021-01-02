const express = require('express')
const SignInService = require('./signIn.service')
const { requireAuth } = require('../middleware/jwt-auth')
const signInRouter = express.Router()
const jsonBodyParser = express.json()

signInRouter
  .post('/login', jsonBodyParser, (req, res, next) => {
    const { email, password } = req.body
    const loginUser = { email, password }

    for (const [key, value] of Object.entries(loginUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

      SignInService.getUserWithEmail(
      req.app.get('db'),
      loginUser.email
    )
      .then(dbUser => {
        if (!dbUser)
          return res.status(400).json({
            error: 'Incorrect email or password',
          })

        return SignInService.comparePasswords(loginUser.password, dbUser.password)
          .then(compareMatch => {
            if (!compareMatch)
              return res.status(400).json({
                error: 'Incorrect email or password',
              })

            const sub = dbUser.email
            const payload = { user_id: dbUser.id }
            res.send({
              authToken: SignInService.createJwt(sub, payload),
            })
          })
      })
      .catch(next)
  })

  signInRouter.post('/refresh', requireAuth, (req, res) => {
    const sub = req.user.email
    const payload = { user_id: req.user.id }
    res.send({
      authToken: SignInService.createJwt(sub, payload),
    })
  })

module.exports = signInRouter