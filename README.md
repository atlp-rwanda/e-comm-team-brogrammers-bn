# e-comm-team-brogrammers-bn
[![CircleCI](https://dl.circleci.com/status-badge/img/gh/atlp-rwanda/e-comm-team-brogrammers-bn/tree/develop.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/atlp-rwanda/e-comm-team-brogrammers-bn/tree/develop)

[![HoundCI](https://img.shields.io/badge/houndci-checked-brightgreen.svg)](https://houndci.com)


[![Coverage Status](https://coveralls.io/repos/github/atlp-rwanda/e-comm-team-brogrammers-bn/badge.svg?branch=develop)](https://coveralls.io/github/atlp-rwanda/e-comm-team-brogrammers-bn?branch=develop)

### How can I test this project

after cloning the repo,
1. in terminal add `npm install`
2. add `.env` file in your repo and assign the variables as there are in `.env.example` file
3. run in termainal `npm run migrate:all` to setup the database
4. run in termainal `npm start` to start the project
5. in your browser add `http://localhost:<your port>/api-docs` for documentantion

# Endpoints
## Registration:
`POST /users/signup`

example of request body:
```
{
  "username": "Pedro Luca",
  "email": "luca@gmail.com",
  "password": "Strong.123",
  "gender": "Male"
}
```
No authentication required
returns a `User` with `success message`

Required fields: `username`, `email`, `password`


## Login:
- First signup a new user and verify the user

`POST /users/login`

Example of request body:
```
{
  "email": "luca@gmail.com",
  "password": "Strong.123"
}
```
With correct email and password you get the following:
- Example Response: `{ id: 1, email: 'luca@gmail.com',  token: 'yourjwttoken' }`

Required fields: `email`, `password`
