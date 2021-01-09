const PhotoService = {
    getAllPhotos(knex, userId) {
      return knex
        .select('*')
        .where('user_id', userId)
        .from('keepbox_photos')
    },
  
    insertPhoto(knex, newPhoto) {
      return knex
        .insert(newPhoto)
        .into('keepbox_photos')
        .where('user_id', newPhoto.user_id)
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id, userId) {
      return knex
        .from('keepbox_photos')
        .select('*')
        .where('id', id)
        .where('user_id', userId)
        .first()
    },
  
    deletePhoto(knex, id) {
      return knex('keepbox_photos')
        .where('id', id)
        .where('user_id', id)
        .delete()
    },
  }
  
  module.exports = PhotoService