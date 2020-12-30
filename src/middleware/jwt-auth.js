const SignInService = require('../signIn/signIn.service')

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let bearerToken
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' })
  } else {
    bearerToken = authToken.slice(7, authToken.length)
  }
  
  try {
    const payload = SignInService.verifyJwt(bearerToken)
      //return payload.user_id
    SignInService.getUserWithEmail(
      req.app.get('db'),
      payload.sub,
      payload.user_id,
    )
      .then(user => {
        if (!user)
          return res.status(401).json({ error: 'Unauthorized request' })
          
        req.user = user
        next()
      })
      .catch(err => {
        console.error(err)
        next(err)
      })
  } catch(error) {
    res.status(401).json({ error: 'Unauthorized request' })
  }
  
}

module.exports = {
  requireAuth,
}