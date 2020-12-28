const path = require('path')
const express = require('express')
//const xss = require('xss')
const PhotoService = require('./photo.service')
const { requireAuth } = require('../middleware/jwt-auth')

const photoRouter = express.Router()
const jsonParser = express.json()

// const serializePhoto = Photo => ({
//   id: Photo.id,
//...addmore
// })

photoRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    PhotoService.getAllPhotos(
      req.app.get('db')
    )
      .then(Photos => {
        res.json(Photos)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { } = req.body
    const newPhoto = {   }

    for (const [key, value] of Object.entries(newPhoto)) {
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
            })
        }
    }
    
    PhotoService.insertPhoto(
      req.app.get('db'),
      newPhoto
    )
      .then(Photo => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${Photo.id}`))
          .json(serializePhoto(Photo))
      })
      .catch(next)
  })

  photoRouter
  .route('/:Photo_id')
  .all(requireAuth)
  .all((req, res, next) => {
    PhotoService.getById(
      req.app.get('db'),
      req.params.Photo_id
    )
      .then(Photo => {
        if (!Photo) {
          return res.status(404).json({
            error: { message: `Photo doesn't exist` }
          })
        }
        res.Photo = Photo
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializePhoto(res.Photo))
  })  
  .delete((req, res, next) => {
    PhotoService.deletePhoto(
      req.app.get('db'),
      req.params.Photo_id
    )
      .then(send => {
        res.status(200).json("photo deleted")
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const {  } = req.body
    const PhotoToUpdate  = {   }

   const numberOfValues = Object.values(PhotoToUpdate).filter(Boolean).length
        if (numberOfValues  === 0) {
            return res.status(400).json({
                error: { message: `Request body must contain either ...` }
            })
        }

    PhotoService.updatePhoto(
      req.app.get('db'),
      req.params.Photo_id,
      PhotoToUpdate
    )
      .then(numRowsAffected  => {
        res
          .status(204).end()
      })
      .catch(next)
  })

module.exports = photoRouter