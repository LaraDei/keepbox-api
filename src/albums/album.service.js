const AlbumService = {

    getAllAlbums(knex, id) {
      console.log(id)
      return knex
        .select('*')
        //.where('user_id', id)
        .from('keepbox_albums')
    },
  
    insertAlbum(knex, newAblbum) {
      return knex
        .insert(newAblbum)
        .into('album')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('album')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteAlbum(knex, id) {
      return knex('album')
        .where({ id })
        .delete()
    },
  
    updateAlbum(knex, id, newAlbumFields) {
      return knex('album')
        .where({ id })
        .update(newAlbumFields)
    },
  }
  
  module.exports = AlbumService