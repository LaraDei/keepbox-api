const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
//const {CLIENT_ORIGIN} = require('./config');
const photoRouter = require('./photos/photo-router')
const albumRouter = require('./albums/album-router')
const signUpRouter = require('./signUp/signUp-router')
const signInRouter = require('./signIn/signIn-router')

const app = express()

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common'

  app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
    skip: () => NODE_ENV === 'test',
  }))
  app.use(cors())
  app.use(helmet())

// app.use(function validateBearerToken(req, res, next) {
//     const apiToken = process.env.API_TOKEN
//     const authToken = req.get('Authorization')
   
//     if (!authToken || authToken.split(' ')[1] !== apiToken) {
//       logger.error(`Unauthorized request to path: ${req.path}`)
//       return res.status(401).json({ error: 'Unauthorized request' })
//     }
    
//     next()
// })


app.use('/api/auth', signUpRouter)

app.use('/api/auth', signInRouter)

app.use('/api/photo', photoRouter)

app.use('/api/album', albumRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})




app.use(function errorHandler(error, req, res, next) {
    let response
    if (NODE_ENV === 'production') {
        response = { error: { message: 'server error' } }
    } else {
        console.error(error)
        response = { message: error.message, error }
    }
    res.status(500).json(response)
})

module.exports = app