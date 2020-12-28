const PhotoService = {
    getAllPhotos(knex) {
      return knex.select('*').from('photos')
    },
  
    insertPhoto(knex, newPhoto) {
      return knex
        .insert(newPhoto)
        .into('photos')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },
  
    getById(knex, id) {
      return knex
        .from('photos')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deletePhoto(knex, id) {
      return knex('photos')
        .where({ id })
        .delete()
    },
  
    updatePhoto(knex, id, newPhotoFields) {
      return knex('photos')
        .where({ id })
        .update(newPhotoFields)
    },
  }
  
  module.exports = PhotoService