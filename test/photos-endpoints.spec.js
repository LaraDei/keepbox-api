const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Photos Endpoints', function() {
  let db

  const {
    testUsers,
    testAlbums,
    testPhotos
  } = helpers.makeAlbumsFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`GET /api/photo`, () => {
        context(`Given no photos`, () => {
          beforeEach(() =>
            helpers.seedUsers(db, testUsers)
          )
          it(`responds with 200 and an empty list`, () => {
            return supertest(app)
              .get('/api/photo')
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(200, [])
          })
        })
        context('Given there are photos in the database', () => {
          beforeEach('insert photos', () =>
            helpers.seedAlbumsTables(
              db,
              testUsers,
              testAlbums,
              testPhotos,
            )
          )
    
          it('responds with 200 and the photos', () => {
            const userId = testUsers[0].id
            const expectedPhotos = helpers.makeExpectedPhotos(
              userId, testPhotos
            )
    
            return supertest(app)
              .get(`/api/photo`)
              .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
              .expect(200, expectedPhotos)
          })
        })
  })

  describe(`GET /api/photo/:photo_Id`, () => {
    context('Given there are photos in the database', () => {
      beforeEach('insert photos', () =>
        helpers.seedAlbumsTables(
          db,
          testUsers,
          testAlbums,
          testPhotos,
        )
      )

      it('responds with 200 and the photo', () => {
        const userId = testUsers[0].id
        const photoId = 1
        const expectedPhoto = helpers.makeExpectedPhotos(
          userId, testPhotos, photoId
        )

        return supertest(app)
          .get(`/api/photo/${photoId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedPhoto)
      })
    })
})

  // describe(`POST /api/photo`, () => {
  //   beforeEach('insert photos', () =>
  //     helpers.seedAlbumsTables(
  //       db,
  //       testUsers,
  //       testAlbums,
  //     )
  //   )

  //   it(`creates an photo, responding with 201 and the new photo`, function() {
  //     this.retries(3)
  //     const testUser = testUsers[0]
  //     const testAlbum = testAlbums[0]
  //     const newPhoto = {
  //       caption: 'Test new photo',
  //       album_id: testAlbum.id,
  //       file_location: 'testfilelocation.jpeg',
  //       user_id: testUser.id
  //     }
  //     return supertest(app)
  //       .post('/api/photo')
  //       .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
  //       .send(newPhoto)
  //       .expect(201)
  //       .expect(res => {
  //         expect(res.body).to.have.property('id')
  //         expect(res.body.caption).to.eql(newPhoto.caption)
  //         expect(res.body.file_location).to.eql(newPhoto.file_location)
  //         expect(res.body.album_id).to.eql(newPhoto.album_id)
  //         expect(res.body.user_id).to.eql(newPhoto.user_id)
  //         const expectedDate = new Date(res.body.date_created).toLocaleString()
  //         const actualDate = new Date(res.body.date_created).toLocaleString()
  //         expect(actualDate).to.eql(expectedDate)
  //       })
  //   })

  //   const requiredFields = ['caption', 'file_location', 'album_id']

  //   requiredFields.forEach(field => {
  //     const testUser = testUsers[0]
  //     const testAlbum = testAlbums[0]
  //     const newPhoto = {
  //       caption: 'Test new photo',
  //       album_id: testAlbum.id,
  //       file_location: 'testfilelocation.jpeg'
  //     }

  //     it(`responds with 400 and an error message when the '${field}' is missing`, () => {
  //       delete newPhoto[field]

  //       return supertest(app)
  //         .post('/api/photo')
  //         .set('Authorization', helpers.makeAuthHeader(testUser))
  //         .send(newPhoto)
  //         .expect(400, {
  //           error: `Missing '${field}' in request body`,
  //         })
  //     })
  //   })
  // })


  describe(`DELETE /api/photo/:photo`, () => {
    context('Given there are photos in the database', () => {
      beforeEach('insert photos', () =>
        helpers.seedAlbumsTables(
          db,
          testUsers,
          testAlbums,
          testPhotos,
        )
      )
    
        it('responds with 200 and removes the photo', () => {
            const idToRemove = testPhotos[0].id
            const userId = testUsers[0].id
            const expectedPhotos =  helpers.makeExpectedPhotos(
              userId, testPhotos
            )
            return supertest(app)
                .delete(`/api/photo/${idToRemove}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, {success: `Deleted Successfully`})
        })
    })
})
})
