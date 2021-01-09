const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Albums Endpoints', function() {
  let db

  const {
    testUsers,
    testAlbums,
    testPhotos,
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

  describe(`GET /api/album`, () => {
    

    context('Given there are albums in the database', () => {
      beforeEach('insert albums', () =>
        helpers.seedAlbumsTables(
          db,
          testUsers,
          testAlbums,
        )
      )

      it('responds with 200 and all of the users albums', () => {
        const userId= testUsers[0].id
        const expectedAlbums = helpers.makeExpectedAlbums(
            userId,
            testAlbums,
          )
    
        return supertest(app)
          .get('/api/album')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedAlbums)
      })
    })
  })

  describe(`GET /api/album/:Album_id`, () => {
    context(`Given no album`, () => {
      beforeEach(() =>
        helpers.seedUsers(db, testUsers)
      )

      it(`responds with 404`, () => {
        const albumId = 123456
        return supertest(app)
          .get(`/api/album/${albumId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error: `Album doesn't exist` })
      })
    })

    context('Given there is an album in the database', () => {
      beforeEach('insert albums', () =>
        helpers.seedAlbumsTables(
          db,
          testUsers,
          testAlbums,
          testPhotos,
        )
      )

      it('responds with 200 and the specified album', () => {
        const albumId = 1
        const userId= testUsers[0].id
        const expectedAlbum = helpers.makeExpectedAlbums(
          userId,
          testAlbums,
          albumId,
        )

        return supertest(app)
          .get(`/api/album/${albumId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(200, expectedAlbum)
      })
    })
  })
  describe(`POST /api/album`, () => {
    beforeEach('insert albums', () =>
      helpers.seedAlbumsTables(
        db,
        testUsers,
        testAlbums,
      )
    )

    it(`creates an album, responding with 201 and the new album`, function() {
      this.retries(3)
      const testUser = testUsers[0]
      const newAlbum = {
        title: 'Test new album',
        user_id: testUser.id
      }
      return supertest(app)
        .post('/api/album')
        .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
        .send(newAlbum)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.title).to.eql(newAlbum.title)
          expect(res.body.user_id).to.eql(newAlbum.user_id)
          const expectedDate = new Date(res.body.date_created).toLocaleString()
          const actualDate = new Date(res.body.date_created).toLocaleString()
          expect(actualDate).to.eql(expectedDate)
        })
    })


    const requiredFields = ['title', 'user_id']

    requiredFields.forEach(field => {
      const testUser = testUsers[0]
      const newAlbum = {
        title: 'Test new album',
        user_id: testUser.id
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newAlbum[field]

        return supertest(app)
          .post('/api/album')
          .set('Authorization', helpers.makeAuthHeader(testUser))
          .send(newAlbum)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
  })

 
})