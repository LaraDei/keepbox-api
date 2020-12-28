const express = require('express')
const SignInService = require('./signIn.service')

const sighInRouter = express.Router()
const jsonBodyParser = express.json()

sighInRouter
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
                error: 'Incorrect user_name or password',
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

module.exports = sighInRouter