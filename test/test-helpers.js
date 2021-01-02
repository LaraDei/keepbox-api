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
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 2,
      file_location: "https://source.unsplash.com/Rrp8yf_LKrg/600x900",
      caption: "construction paper santa face",
      summary: "",
      album_id: albums[0].id,
      user_id: users[1].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 3,
      file_location: "https://source.unsplash.com/HkzqKFYOn3M/600x900",
      caption: "orange sun set with butterfly",
      summary: "",
      album_id: albums[0].id,
      user_id: users[2].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 4,
      file_location: "https://test.unsplash.com/1VT2qoBtc-k/900x600",
      caption: "child makes playdough rainbow",
      summary: "",
      album_id: albums[0].id,
      user_id: users[3].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 6,
      file_location: "https://source.unsplash.com/Ia02X7WcPn0/900x600",
      caption: "fingpaint ghost",
      summary: "",
      album_id: albums[albums.length - 1].id,
      user_id: users[2].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
    {
      id: 7,
      file_location: "https://source.unsplash.com/Ia02X7WcPn0/900x600",
      caption: "fingpaint ghost",
      summary: "",
      album_id: albums[3].id,
      user_id: users[0].id,
      date_created: new Date('2029-01-22T16:28:32.615Z'),
      date_uploaded: new Date('2029-01-22T16:28:32.615Z'),
    },
  ];
}

function makeExpectedAlbums(users, album, photos=[]) {
  const author = users
    .find(user => user.id === album.user_id)

  const number_of_photos = photos
    .filter(photo => photo.album_id === album.id)
    .length

  return {
    id: album.id,
    title: album.title,
    date_created: article.date_created.toISOString(),
    number_of_photos,
    author: {
      id: author.id,
      email: author.email,
      full_name: author.full_name,
      date_created: author.date_created.toISOString(),
      date_modified: author.date_modified || null,
    },
  }
}

function makeExpectedAlbumPhotos(users, albumId, photos) {
  const expectedPhotos = photos
    .filter(photo => photo.album_id === albumId)

  return expectedPhotos.map(photo => {
    const photoUser = users.find(user => user.id === photo.user_id)
    return {
      id: photo.id,
      caption: photo.caption,
      date_created: photo.date_created.toISOString(),
      date_uploaded: photo.date_uploaded,
      summary: photo.summary,
      file_location: photo.file_location,
      age: photo.age,
      user: {
        id: commentUser.id,
        email: commentUser.email,
        full_name: commentUser.full_name,
        date_created: commentUser.date_created.toISOString(),
        date_modified: commentUser.date_modified || null,
      }
    }
  })
}

function makeMaliciousAlbum(user) {
  const maliciousAlbum = {
    id: 911,
    title: 'Naughty naughty very naughty <script>alert("xss");</script>',
    date_created: new Date(),
    user_id: user.id,
  }
  const expectedAlbum = {
    ...makeMaliciousAlbum([user], maliciousAlbum),
    title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.',
  }
  return {
    maliciousAlbum,
    expectedAlbum,
  }
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

function seedMaliciousAlbum(db, user, album) {
  return seedUsers(db, [user])
    .then(() =>
      db
        .into('keepbox_albums')
        .insert([album])
    )
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
  makeExpectedAlbumPhotos,
  makeMaliciousAlbum,
  makePhotosArray,

  makeAlbumsFixtures,
  cleanTables,
  seedAlbumsTables,
  seedMaliciousAlbum,
  makeAuthHeader,
  seedUsers,
}