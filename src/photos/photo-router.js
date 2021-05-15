const path = require('path')
const express = require('express')
const PhotoService = require('./photo.service')
const { requireAuth } = require('../middleware/jwt-auth')
const upload = require('../middleware/uploader')

const photoRouter = express.Router()
const jsonParser = express.json()

const serializePhoto = Photo => ({
  id: Photo.id,
  caption: Photo.caption,
  date_created: Photo.date_created,
  summary: Photo.summary,
  file_location: Photo.file_location,
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
  .post( upload.single('file_location'), (req, res, next) => {
    const image = req.file.location
    const file_location = image
    const { caption, summary, album_id, date_created } = req.body
    const user_id = req.user.id
    const newPhoto = {caption, summary, file_location, album_id, user_id, date_created  }
    for (const field of ['caption', 'album_id']) {
      if (!req.body[field])  {
            return res.status(400).json({
                error: `Missing '${field}' in request body`
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
          // .location(path.posix.join(req.originalUrl, `/${Photo.id}`))
          .json(serializePhoto(Photo))
      })
      .catch(next)
  })

  photoRouter
  .route('/:photo_id')
  .all(requireAuth)
  .all((req, res, next) => {
    PhotoService.getById(
      req.app.get('db'),
      req.params.photo_id,
      req.user.id
    )
      .then(Photo => {
        if (!Photo) {
          return res.status(404).json({
            error: `Photo doesn't exist`
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
      req.params.photo_id,
      req.user.id
    )
      .then(send => {
        res.status(200).json({success: `Deleted Successfully`})
      })
      .catch(next)
  })
  

module.exports = photoRouter