### keepbox API
# KeepBox
[keepbox](https://keepbox.vercel.app/ "keepbox")

## keepbox API
This API allows users from keepbox to interact with their accounts. 

## Open Endpoints

# `POST` /api/auth/sign-up
| Name      | Type   | In   | Description |
|-----------|--------|------|-------------|
| password  | string | body | REQUIRED    |
| email     | string | body | REQUIRED    |
| full_name | string | body | REQUIRED    |
`default responses`
* authToken: ******
* Status: 400 'Incorrect email or password'
* Status: 400 'Missing '${key}' in request body'

# `POST` /api/auth/login
| Name     | Type   | In   | Description |
|----------|--------|------|-------------|
| password | string | body | REQUIRED    |
| email    | string | body | REQUIRED    |
`default responses`
* Status: 201 
    * { "authToken": "eyJhbGciOsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjox20ifQ.U-KjAKzBySAnFeshBQoOPK2ErLdgBI"}
* Status: 400 'Email already taken'
* Status: 400 'Missing '${key}' in request body'

## All endoints below require Auth`

# `GET`  /api/album
| Name         | Type | In             | Description |
|--------------|------|----------------|-------------|
| bearer token | JWT  | Authorization  | REQUIRED    |
`default responses`
* Status: 401 Unauthorized
* Status: 201 JSON album data
    * [
    {
        "id": 1,
        "title": "New Album",
        "date_created": "2020-12-31T22:52:31.598Z",
        "user_id": 1
    },
    {
        "id": 4,
        "title": "Cool Album",
        "date_created": "2021-01-01T03:26:36.769Z",
        "user_id": 1
    }
]


# `POST`  /api/album
| Name         | Type   | In             | Description |
|--------------|--------|----------------|-------------|
| bearer token | JWT    | Authorization  | REQUIRED    |
| title        | string | body           | REQUIRED    |
`default responses`
* Status: 401 Unauthorized
* Status: 400 'Missing '${key}' in request body'
* Status: 201 JSON album data
    * {
    "id": 9,
    "title": "Happy"
    }

# `GET`  /api/album/{album_id}
| Name         | Type   | In             | Description |
|--------------|--------|----------------|-------------|
| bearer token | JWT    | Authorization  | REQUIRED    |
| album_id     | number | path           | REQUIRED    |
`default responses`
* Status: 401 Unauthorized
* Status: 201 JSON album data
    * {
    "id": 1,
    "title": "New Album"
    }

# `GET` /api/photo
| Name         | Type | In             | Description |
|--------------|------|----------------|-------------|
| bearer token | JWT  | Authorization  | REQUIRED    |
`default responses`
* Status: 401 Unauthorized
* Status: 201 JSON photo data
    * {
        {
        "id": 3,
        "caption": "orange sun set with butterfly",
        "summary": "Photo by Andrey Shpigunov on Unsplash",
        "file_location": "https://source.unsplash.com/HkzqKFYOn3M/600x900",
        "date_uploaded": "2021-01-02T20:32:12.463Z",
        "date_created": null,
        "age": null,
        "user_id": 1,
        "album_id": 4
    },
    {
        "id": 4,
        "caption": "fingpaint ghost",
        "summary": "Photo by Markus Spiske on Unsplash",
        "file_location": "https://source.unsplash.com/Ia02X7WcPn0/900x600",
        "date_uploaded": "2021-01-02T20:32:58.486Z",
        "date_created": null,
        "age": null,
        "user_id": 1,
        "album_id": 4
    },
    }

# `POST` /api/photo
| Name          | Type   | In             | Description |
|---------------|--------|----------------|-------------|
| bearer token  | JWT    | Authorization  | REQUIRED    |
| album_id      | number | path           | REQUIRED    |
| caption       | string | body           | REQUIRED    |
| summary       | string | body           |             |
| file_location | string | body           | REQUIRED    |
| date_created  | string | body           |             |
`default responses`
* Status: 401 Unauthorized
* Status: 400 'Missing '${key}' in request body'
* Status: 201 JSON photo data


# `GET`  /api/photo/{photo_id}
| Name         | Type   | In             | Description |
|--------------|--------|----------------|-------------|
| bearer token | JWT    | Authorization  | REQUIRED    |
| photo_id     | number | path           | REQUIRED    |
`default responses`
* Status: 401 Unauthorized
* Status: 201 JSON photo data
    * {
    {
        "id": 4,
        "caption": "fingpaint ghost",
        "summary": "Photo by Markus Spiske on Unsplash",
        "file_location": "https://source.unsplash.com/Ia02X7WcPn0/900x600",
        "date_uploaded": "2021-01-02T20:32:58.486Z",
        "date_created": null,
        "age": null,
        "user_id": 1,
        "album_id": 4
    },
    }

# `DELETE`  /api/photo/{photo_id}
| Name         | Type   | In             | Description |
|--------------|--------|----------------|-------------|
| bearer token | JWT    | Authorization  | REQUIRED    |
| photo_id     | number | path           | REQUIRED    |
`default responses`
* Status: 401 Unauthorized
* Status: 404 'Photo doesn't exist'
* Status: 200 'Deleted Successfully'

# How to Use KeepBox
![Landing Page](/src/images/landingPage.JPG)

KeepBox helps you keep track of your child's artistic and creative milestones and functions as a photo album.

You can see the general layout by clicking on the demo link on the navigation bar. 
![Demo](/src/images/demo.JPG)
There you will see what the user's dashboard looks like with some albums and photo examples. You will not be able to add albums or photos from the demo dashboard.

You can create an account and sign in to access all of the user functions. 
![Create account](/src/images/signup.JPG)
![Sign In](/src/images/signin.JPG)

This app is mobile friendly!
![Mobile Album](/src/images/mobilealbum.JPG)
![Mobile Navigation](/src/images/mobilenav.JPG)


# Technology Used
* JS
* REACT
* JSX
* CSS
* HTML
* AJAX
* [Simple-File-Upload](https://www.simplefileupload.com/ "Simple-File-Upload")
* JWT
* SQL
* postgresql
* Node
* Heroku
