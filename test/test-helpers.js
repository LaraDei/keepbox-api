const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      id: 1,
      email: 'test-user-1@test.com',
      full_name: 'Test user 1',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      email: 'test-user-2@test.com',
      full_name: 'Test user 2',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      email: 'test-user-3@test.com',
      full_name: 'Test user 3',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      email: 'test-user-4@test.com',
      full_name: 'Test user 4',
      password: 'password',
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
  ]
}

function makeAlbumsArray(users) {
  return [
    {
      id: 1,
      title: 'First test album!',
      user_id: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      title: 'Second test album!',
      user_id: users[1].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      title: 'Third test album!',
      user_id: users[2].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      title: 'Fourth test album!',
      user_id: users[3].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),

    },
  ]
}

function makePhotosArray(users, albums) {
  return [
    {
      id: 1, 
      file_location: "https://source.unsplash.com/skmzjgBlCIA/900x600",
      caption: "sand castle",
      summary: "",
      album_id: albums[0].id,
      user_id: users[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      file_location: "https://source.unsplash.com/Rrp8yf_LKrg/600x900",
      caption: "construction paper santa face",
      summary: "",
      album_id: albums[0].id,
      user_id: users[1].id,
      date_created: '2029-01-22T16:28:32.615Z',
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      file_location: "https://source.unsplash.com/HkzqKFYOn3M/600x900",
      caption: "orange sun set with butterfly",
      summary: "",
      album_id: albums[0].id,
      user_id: users[2].id,
      date_created: '2029-01-22T16:28:32.615Z',
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      file_location: "https://test.unsplash.com/1VT2qoBtc-k/900x600",
      caption: "child makes playdough rainbow",
      summary: "",
      album_id: albums[0].id,
      user_id: users[3].id,
      date_created: '2029-01-22T16:28:32.615Z',
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 6,
      file_location: "https://source.unsplash.com/Ia02X7WcPn0/900x600",
      caption: "fingpaint ghost",
      summary: "",
      album_id: albums[albums.length - 1].id,
      user_id: users[2].id,
      date_created: '2029-01-22T16:28:32.615Z',
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 7,
      file_location: "https://source.unsplash.com/Ia02X7WcPn0/900x600",
      caption: "fingpaint ghost",
      summary: "",
      album_id: albums[3].id,
      user_id: users[0].id,
      date_created: '2029-01-22T16:28:32.615Z',
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
  ];
}

function makeExpectedAlbums(userId, albums, albumId) {
  const expectedAlbums = albums
    .filter(album => userId === album.user_id)
  if(albumId){
    const expectedAlbum = expectedAlbums.find(album => albumId === album.id)
    return {
      id: expectedAlbum.id,
      title: expectedAlbum.title,
      user_id: expectedAlbum.user_id
    }
  }
  return expectedAlbums.map(album => {
    return {
    id: album.id,
    title: album.title,
    date_created: album.date_created.toISOString(),
    user_id: album.user_id
    }
  })
}

function makeExpectedPhotos(userId, photos, photoId) {
  const expectedPhotos = photos
    .filter(photo => photo.user_id === userId)
  if(photoId){
    const expectedPhoto = expectedPhotos.find(photo => photoId === photo.id)
    return {
      id: expectedPhoto.id,
      caption: expectedPhoto.caption,
      date_created: expectedPhoto.date_created,
      summary: expectedPhoto.summary,
      file_location: expectedPhoto.file_location,
      age: expectedPhoto.age || null,
      user_id: expectedPhoto.user_id,
      album_id: expectedPhoto.album_id,
    }
  } else
  return expectedPhotos.map(photo => {
    return {
      id: photo.id,
      caption: photo.caption,
      summary: photo.summary,
      file_location: photo.file_location,
      date_uploaded: photo.date_uploaded.toISOString(),
      date_created: photo.date_created,
      age: photo.age || null,
      user_id: photo.user_id,
      album_id: photo.album_id,
    }
  })
}


function makeAlbumsFixtures() {
  const testUsers = makeUsersArray()
  const testAlbums = makeAlbumsArray(testUsers)
  const testPhotos = makePhotosArray(testUsers, testAlbums)
  return { testUsers, testAlbums, testPhotos }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        keepbox_users,
        keepbox_albums,
        keepbox_photos
      `
    )
    .then(() =>
      Promise.all([
        trx.raw(`ALTER SEQUENCE keepbox_albums_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE keepbox_users_id_seq minvalue 0 START WITH 1`),
        trx.raw(`ALTER SEQUENCE keepbox_photos_id_seq minvalue 0 START WITH 1`),
        trx.raw(`SELECT setval('keepbox_albums_id_seq', 0)`),
        trx.raw(`SELECT setval('keepbox_users_id_seq', 0)`),
        trx.raw(`SELECT setval('keepbox_photos_id_seq', 0)`),
      ])
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('keepbox_users').insert(preppedUsers)
    .then(() =>
      // update the auto sequence to stay in sync
      db.raw(
        `SELECT setval('keepbox_users_id_seq', ?)`,
        [users[users.length - 1].id],
      )
    )
}

function seedAlbumsTables(db, users, albums, photos=[]) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await trx.into('keepbox_albums').insert(albums)
    // update the auto sequence to match the forced id values
    await trx.raw(
      `SELECT setval('keepbox_albums_id_seq', ?)`,
      [albums[albums.length - 1].id],
    )
    // only insert photos if there are some, also update the sequence counter
    if (photos.length) {
      await trx.into('keepbox_photos').insert(photos)
      await trx.raw(
        `SELECT setval('keepbox_photos_id_seq', ?)`,
        [photos[photos.length - 1].id],
      )
    }
  })
}


function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.id }, secret, {
    subject: user.email,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeAlbumsArray,
  makeExpectedAlbums,
  makeExpectedPhotos,
  makePhotosArray,

  makeAlbumsFixtures,
  cleanTables,
  seedAlbumsTables,
  makeAuthHeader,
  seedUsers,
}