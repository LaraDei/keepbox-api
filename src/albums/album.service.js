const AlbumService = {

    getAllAlbums(knex, id) {
      return knex
        .select('*')
        .where('user_id', id)
        .from('keepbox_albums')
    },
  
    insertAlbum(knex, newAblbum) {
      return knex
        .insert(newAblbum)
        .into('keepbox_albums')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id, userId) {
      return knex
        .from('keepbox_albums')
        .select('*')
        .where('id', id)
        .where('user_id', userId)
        .first()
    },

  }
  
  module.exports = AlbumService