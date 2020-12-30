const AlbumService = {

    getAllAlbums(knex, id) {
      return knex
        .select('*')
        .where('user_id', id)
        .from('keepbox_albums')
    },
  
    insertAlbum(knex, newAblbum) {
      console.log(newAblbum)
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
  
    deleteAlbum(knex, id, userId) {
      return knex('keepbox_albums')
        .where({ id })
        .where('user_id', userId)
        .delete()
    },
  
    updateAlbum(knex, id, newAlbumFields) {
      return knex('keepbox_albums')
        .where({ id })
        .where('user_id', newAlbumFields.user_id)
        .update(newAlbumFields)
    },
  }
  
  module.exports = AlbumService