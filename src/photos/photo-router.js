const path = require('path')
const express = require('express')
const PhotoService = require('./photo.service')
const { requireAuth } = require('../middleware/jwt-auth')

const photoRouter = express.Router()
const jsonParser = express.json()

const serializePhoto = Photo => ({
  id: Photo.id,
  caption: Photo.caption,
  summary: Photo.summary,
  file_location: Photo.file_location,
  date_uploaded: Photo.date_uploaded,
  date_created: Photo.date_created,
  age: Photo.age,
  user_id: Photo.user_id,
  album_id: Photo.album_id,
})

photoRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    PhotoService.getAllPhotos(
      req.app.get('db'),
      req.user.id
    )
      .then(Photos => {
        res.json(Photos)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { caption, summary, file_location, album_id, date_created } = req.body
    const user_id = req.user.id
    const newPhoto = {caption, summary, file_location, album_id, user_id, date_created  }

    for (const field of ['caption', 'file_location', 'album_id']) {
      if (!req.body[field])  {
            return res.status(400).json({
                error: { message: `Missing '${field}' in request body` }
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
      req.params.Photo_id,
      req.user.id
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
      req.params.Photo_id,
      req.user.id
    )
      .then(send => {
        res.status(200).json("photo deleted")
      })
      .catch(next)
  })
  .patch(jsonParser, (req, res, next) => {
    const { caption, summary, file_location, album_id, date_created, age  } = req.body
    const user_id = req.user.id
    const PhotoToUpdate  = { caption, summary, file_location, album_id, user_id, date_created, age, }

    for (const field of ['album_id'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

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