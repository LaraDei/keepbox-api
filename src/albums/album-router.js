const path = require('path')
const express = require('express')
//const xss = require('xss')
const AlbumService = require('./album.service')
const { requireAuth } = require('../middleware/jwt-auth')
const albumRouter = express.Router()
const jsonParser = express.json()

// const serializealbum = album => ({
//   id: album.id,
//...addmore
// })

albumRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    AlbumService.getAllAlbums(
      req.app.get('db')
    )
      .then(Albums => {
        res.json(Albums)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
    const { } = req.body
    const newAlbum = {   }

    for (const [key, value] of Object.entries(newAlbum)) {
        if (value == null) {
            return res.status(400).json({
                error: { message: `Missing '${key}' in request body` }
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
      req.params.Album_id
    )
      .then(Album => {
        if (!Album) {
          return res.status(404).json({
            error: { message: `Album doesn't exist` }
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
  
  .patch(jsonParser, (req, res, next) => {
    const {  } = req.body
    const AlbumToUpdate  = {   }

   const numberOfValues = Object.values(AlbumToUpdate).filter(Boolean).length
        if (numberOfValues  === 0) {
            return res.status(400).json({
                error: { message: `Request body must contain either ...` }
            })
        }

    AlbumService.updateAlbum(
      req.app.get('db'),
      req.params.Album_id,
      AlbumToUpdate
    )
      .then(numRowsAffected  => {
        res
          .status(204).end()
      })
      .catch(next)
  })

module.exports = albumRouter