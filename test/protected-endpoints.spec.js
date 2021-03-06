const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected endpoints', function() {
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

  beforeEach('insert albums', () =>
    helpers.seedAlbumsTables(
      db,
      testUsers,
      testAlbums,
      testPhotos,
    )
  )

  const protectedEndpoints = [
    {
      name: 'GET /api/album/:album_id',
      path: '/api/album/1',
      method: supertest(app).get,
    },
    {
      name: 'GET /api/photo/:photo_id',
      path: '/api/photo/1',
      method: supertest(app).get,
    },
    {
      name: 'GET /api/album',
      path: '/api/album',
      method: supertest(app).get,
    },
    {
      name: 'GET /api/photo',
      path: '/api/photo',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/photo',
      path: '/api/photo',
      method: supertest(app).get,
    },
    {
      name: 'POST /api/album',
      path: '/api/album',
      method: supertest(app).get,
    },
    {
      name: 'DELETE /api/photo/:photo_id',
      path: '/api/album/1',
      method: supertest(app).get,
    },
    {
      name: 'DELETE /api/album/:album_id',
      path: '/api/album/1',
      method: supertest(app).get,
    },
    {
      name: 'PATCH /api/photo/:photo_id',
      path: '/api/album/1',
      method: supertest(app).get,
    },
    {
      name: 'PATCH /api/album/:album_id',
      path: '/api/album/1',
      method: supertest(app).get,
    },

  ]

  protectedEndpoints.forEach(endpoint => {
    describe(endpoint.name, () => {
      it(`responds 401 'Missing bearer token' when no bearer token`, () => {
        return endpoint.method(endpoint.path)
          .expect(401, { error: `Missing bearer token` })
      })

      it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
        const validUser = testUsers[0]
        const invalidSecret = 'bad-secret'
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, { error: `Unauthorized request` })
      })

      it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
        const invalidUser = { email: 'user-not-existy@test.com', id: 1 }
        return endpoint.method(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, { error: `Unauthorized request` })
      })
    })
  })
})