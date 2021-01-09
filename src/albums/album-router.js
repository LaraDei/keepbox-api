const path = require('path')
const express = require('express')
const AlbumService = require('./album.service')
const { requireAuth } = require('../middleware/jwt-auth')
const albumRouter = express.Router()
const jsonParser = express.json()

 const serializeAlbum = album => ({
    id: album.id,
    title: album.title,
    user_id: album.user_id,
})

albumRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    AlbumService.getAllAlbums(
      req.app.get('db'), 
      req.user.id
    )
      .then(Albums => {
        res.json(Albums)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { title} = req.body
    const user_id = req.user.id
    const newAlbum = { title, user_id  }

    for (const field of ['title', 'user_id']) {
      if (!req.body[field])  {
            return res.status(400).json({
                error: `Missing '${field}' in request body`
            })
        }
    }
    
    AlbumService.insertAlbum(
      req.app.get('db'),
      newAlbum
    )
      .then(Album => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${Album.id}`))
          .json(serializeAlbum(Album))
      })
      .catch(next)
  })

  albumRouter
  .route('/:Album_id')
  .all(requireAuth)
  .all((req, res, next) => {
    AlbumService.getById(
      req.app.get('db'),
      req.params.Album_id,
      req.user.id
    )
      .then(Album => {
        if (!Album) {
          return res.status(404).json({
            error: `Album doesn't exist`
          })
        }
        res.Album = Album
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeAlbum(res.Album))
  })

  

module.exports = albumRouter