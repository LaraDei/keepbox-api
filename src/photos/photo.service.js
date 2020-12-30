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
        .where('user_id', userId)
        .where('id', id)
        .first()
    },
  
    deletePhoto(knex, id, userId) {
      return knex('keepbox_photos')
        .where('user_id', userId)
        .where({ id })
        .delete()
    },
  
    updatePhoto(knex, id, newPhotoFields) {
      return knex('keepbox_photos')
        .where('user_id', newPhotoFields.user_id )
        .where({ id })
        .update(newPhotoFields)
    },
  }
  
  module.exports = PhotoService