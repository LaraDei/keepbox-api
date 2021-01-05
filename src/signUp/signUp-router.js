const express = require('express')
const path = require('path')
const SignUpService = require('./signUp.service')

const signUpRouter = express.Router()
const jsonBodyParser = express.json()

signUpRouter
  .post('/sign-up', jsonBodyParser, (req, res, next) => {
    const { password, email, full_name } = req.body

    for (const field of ['full_name', 'email', 'password'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })


    const passwordError = SignUpService.validatePassword(password)
    const emailError = SignUpService.validateEmail(email)

    if (passwordError)
      return res.status(400).json({ error: passwordError })
    if (emailError)
      return res.status(400).json({ error: emailError })

      SignUpService.hasUserWithEmail(
      req.app.get('db'),
      email
    )
      .then(hasUserWithEmail => {
        if (hasUserWithEmail)
          return res.status(400).json({ error: `Email already taken` })

        return SignUpService.hashPassword(password)
          .then(hashedPassword => {
            const newUser = {
              email,
              password: hashedPassword,
              full_name,
              date_created: 'now()',
            }

            return SignUpService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(SignUpService.serializeUser(user))
              })
          })
      })
      .catch(next)
  })

module.exports = signUpRouter