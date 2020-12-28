const AlbumService = {
    getAllAlbums(knex) {
      return knex.select('*').from('albums')
    },
  
    insertAlbum(knex, newAblbum) {
      return knex
        .insert(newAblbum)
        .into('albums')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('albums')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteAlbum(knex, id) {
      return knex('albums')
        .where({ id })
        .delete()
    },
  
    updateAlbum(knex, id, newAlbumFields) {
      return knex('albums')
        .where({ id })
        .update(newAlbumFields)
    },
  }
  
  module.exports = AlbumService