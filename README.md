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

- WITH OUT MFA Response: `{ email: me@mail.com, token : 'jwt token' }`
- WITH MFA Response: `{ message: 'Please check your email for authentication code' }`

Required fields: `email`, `password`


## Mulit-factor authentication
- After a successful login
- Enable MFA with `POST` request at `/users/enable-mfa` provind jwt token
- Get the mfa code from your email

`POST /users/verify-mfa`
Example of request body:

```
{
  "email": "someone@mail.com",
  "mfa_code": 121212
}
```

Required fields: `email`, `mfa_code`

Example Response: `{email: 'luca@gmail.com',  token: 'yourjwttoken'}`

- You may also disbale MFA with `POST` request at `/users/enable-mfa` provind jwt token


## profile:
- First signup a new user and verify the user
- then login to get the token
- add your token in header
- note: `token is required`

### get profile

`GET /users/profile`

With correct token you get the following:
- Example Response: 
```
{ 
  username: 'luca'
  email: 'luca@gmail.com',  
  gender: 'none',
  role: 'buyer'
}
```

### change profile

`GET /users/profile`

Example of request body:
```
{
  "username: "new luca",
  "email": "newluca@gmail.com",
  "gender": "none"
}
```
With correct token you get the following:
- Example Response: 
```
{ 
  "token": "<string>"
  "username: "new luca",
  "email": "newluca@gmail.com",
  "gender": "none",
  "role": "buyer"
}
```

`change the token because some data in it was changed too`

## Making user an admin
- please if you are admin be sure to be logged in
- get the token and put it in bearer

`patch /users/create-admin/email`
- where email is email of user to be updated 
- sample response body

```
{
  "user": {
    "id": "e1a1d30b-d441-4123-aadd-a682dc2a3fa1",
    "username": "Ange She",
    "email": "ange@gmail.com",
    "password": "$2b$10$9h3SncimWZLoC0a2yYogZ.tkLD.sH5Yl1XBQEAy8mKP33rKWmdeM.",
    "role": "admin",
    "verified": null,
    "email_token": null,
    "gender": "female",
    "createdAt": "2023-03-14T10:44:57.461Z",
    "updatedAt": "2023-03-14T10:47:31.679Z"
  },
  "message": "user Ange She sucessfully made admin"
}
```

### Change password:

`PATCH /users/change-password`

Example of request body:

```
{
    "email":"ange@gmail.com",
    "oldPassword":"123@Password",
    "newPassword":"123@Pass"
}
```
with correct email,oldPassword and newPassword. the newPassword much meet the criteria of valid password

## Notify users to change password
- First signup a new user and verify the user
- then login to get the token
- add your token in header
- Ater an amount of time we specified the cron job starts to run and send an email to remind a user to change their password
- After login the user will be redirected to the change password page to change their password
- We will be using an existing endpoint


   `PATCH /users/change-password`

## PRODUCTS

## Post product

`POST /products/`

- First signup a new user and verify the user
- then login to get the token
- add your token in header
- note: `token is required`

Example of request body:

```
{
  "name": "shoes",
  "description": "new shoes on the market",
  "price": "100",
  "quantity": "30",
  "category": "1",
  "expdate": "03-20-2030"
  "images": <file>,
  "images": <file>,
  "images": <file>,
}
```

if you are a seller you will get this response:
```
{
  "message": "product edited",
  "product": {
    "id": "531f60c8-d7e4-4c7e-9316-9d226237b356",
    "images": [
      "http://res.cloudinary.com/dpfueuupz/image/upload/v1678901154/ddhyu8kryfuucpzcis9v.jpg",
      "http://res.cloudinary.com/dpfueuupz/image/upload/v1678901159/iclk1ovdiihr6jgzozuy.png"
    ],
    "name": "nike new",
    "description": "hey you can buy new shoes",
    "quantity": 100,
    "sellerId": "963b5889-a9e6-4b5b-815d-ffc7f5a6975f",
    "exp_date": "2030-03-01T22:00:00.000Z",
    "available": false,
    "price": 250,
    "category": 2,
    "createdAt": "2023-03-15T17:20:57.685Z",
    "updatedAt": "2023-03-15T17:28:08.077Z"
  }
}
```
Required fields: `name`, `price`, `quantity`, `images`

## Update product

`PATCH /products/:id`

- First signup a new user and verify the user
- then login to get the token
- add your token in header
- product must be in your collection
- note: `token is required`

Example of request body:

```
{
  "name": "shoes",
  "description": "new shoes on the market",
  "price": "100",
  "quantity": "30",
  "category": "1",
  "expdate": "03-20-2030"
  "images": <file>,
  "images": <file>,
  "images": <file>,
}
```

if you are a seller you will get this response:
```
{
  "message": "product edited",
  "product": {
    "id": "531f60c8-d7e4-4c7e-9316-9d226237b356",
    "images": [
      "http://res.cloudinary.com/dpfueuupz/image/upload/v1678901154/ddhyu8kryfuucpzcis9v.jpg",
      "http://res.cloudinary.com/dpfueuupz/image/upload/v1678901159/iclk1ovdiihr6jgzozuy.png"
    ],
    "name": "nike new",
    "description": "hey you can buy new shoes",
    "quantity": 100,
    "sellerId": "963b5889-a9e6-4b5b-815d-ffc7f5a6975f",
    "exp_date": "2030-03-01T22:00:00.000Z",
    "available": false,
    "price": 250,
    "category": 2,
    "createdAt": "2023-03-15T17:20:57.685Z",
    "updatedAt": "2023-03-15T17:28:08.077Z"
  }
}
```
Required fields: no `field required`

## Delete Product
- First signup a new user and verify the user
- then login to get the token
- add your token in header
- product must be in your collection
- note: `token is required`

Example of request body:

```
{
  "id": "id of the product to delete",
}
```

if you are a seller of that product you will get this response:
```
{
  "status": 200,
  "message": "Product deleted successfully",
  "item": {
    "id": "04906672-7a61-434e-b3c5-07ab35d0c40d",
    "images": [
      "http://res.cloudinary.com/du0vsc2pt/image/upload/v1679312631/dutnxv74ydhrw6nqmdkl.jpg",
      "http://res.cloudinary.com/du0vsc2pt/image/upload/v1679312635/eemjvmu3hh2jhidr0qom.jpg"
    ],
    "name": "shoe",
    "description": "new nike shoes",
    "quantity": 20,
    "sellerId": "5613282a-6212-4a73-b513-580577cd939d",
    "exp_date": "2023-11-21T22:00:00.000Z",
    "available": true,
    "price": 200,
    "category": 2,
    "createdAt": "2023-03-20T11:43:54.758Z",
    "updatedAt": "2023-03-20T11:43:54.758Z"
  }
}
```
Required fields: ` id for the product to delete`



## Get single product
`GET /products/:id`

anyOne can view the product if it is available
if you are a seller you will get this response:
```
{
  "id": "531f60c8-d7e4-4c7e-9316-9d226237b356",
  "images": [
    "http://res.cloudinary.com/dpfueuupz/image/upload/v1678901154/ddhyu8kryfuucpzcis9v.jpg",
    "http://res.cloudinary.com/dpfueuupz/image/upload/v1678901159/iclk1ovdiihr6jgzozuy.png"
  ],
  "name": "nike new",
  "description": "hey you can buy new shoes",
  "quantity": 100,
  "sellerId": "963b5889-a9e6-4b5b-815d-ffc7f5a6975f",
  "exp_date": "2030-03-01T22:00:00.000Z",
  "available": true,
  "price": 250,
  "category": 2,
  "createdAt": "2023-03-15T17:20:57.685Z",
  "updatedAt": "2023-03-15T17:28:08.077Z"
}
```

## change product availability
`PATCH /products/:id/available/`

- First signup a new user and verify the user
- then login to get the token
- add your token in header
- product must be in your collection
- note: `token is required`

   `PATCH /users/change-password`
### Setting role/permission to the given user
- First yoou logged in as Admin to be allowed to set role
- get the token and put it in bearer
- then click Authorize

`patch /users/:id/role`
- where id is the id of user you want to give a given role

Example response body:
```
{
  "role": "<role you want to give user>"
}
```
With the correct token of admin and correct id of user  you get the following:
- Example Response: 
```
{ 
  "token": "<string>"
  "username: "string",
  "email": "string",
  "gender": "string",
  "role": "updated role"
}
```

this will change product availability to true if it was false or false if it was true


## Adding product to wishlist
`post /wishlist/:id/`

- first get the id of product you want to add to wishlist
- if no product create one
- login and put token in bearer auth
- product id must be available
- you can not wish for product twice
- note: `token is required`
 you will get this response
 
 ```

{
  "data": {
    "id": "642df59a-d79d-431a-92b2-2e6e90fd1901",
    "userId": "2f91fac7-6a38-4162-af8b-84d67861e6f4",
    "productId": "2c664f24-a604-4ed1-96c3-f96b1972c101",
    "updatedAt": "2023-03-21T10:14:10.157Z",
    "createdAt": "2023-03-21T10:14:10.157Z"
  },
  "message": "product added to your wishlist successfully"
}
```

## Getting all  products in your  wishlist
`get /wishlist/`

- login and put token in bearer auth
- product id must be available
- note: `token is required`

you will get this response 

```
{
  "message": "Ange She here is product in your wishlist",
  "data": [
    {
      "id": "2c664f24-a604-4ed1-96c3-f96b1972c101",
      "images": [
        "http://res.cloudinary.com/du0vsc2pt/image/upload/v1679392751/qerw59puucgm5djziuxf.png",
        "http://res.cloudinary.com/du0vsc2pt/image/upload/v1679392754/vhplcicfm7ovvff7hltc.png"
      ],
      "name": "shoes",
      "description": "new shoes on the market",
      "quantity": 20,
      "sellerId": "c8c929a9-88f9-447a-9b8e-d49fb8c62eb8",
      "exp_date": "2030-03-19T22:00:00.000Z",
      "available": true,
      "price": 90,
      "category": 1,
      "createdAt": "2023-03-21T09:59:14.601Z",
      "updatedAt": "2023-03-21T09:59:16.956Z"
    }
  ]
}

```


## Remove a product from your wishlist 
`delete /wishlist/productID`

- login and put token in bearer auth
- product id must be available
- note: `token is required`

you will get this response 

```
{
  "message": "deleted from wishlist "
}
```

## Remove clear your wishlist 
`patch /wishlist/clear`

- login and put token in bearer auth
- note: `token is required`

```
{
  "message": " wishlists have been cleared"
}
```

## Get all wishlists for all users
`get /wishlist/all`

- login and put token in bearer auth
- note: `token is required`

```
{
  "message": " all wishlists",
  "data": [
    {
      "id": "e22a63de-3e61-4ee4-89b4-d5489ef3b24c",
      "userId": "98bb7cc4-3c62-45ca-9e38-fcaa4f664917",
      "productId": "b0caa512-30f7-4baf-91c9-85ead104ac16",
      "createdAt": "2023-03-23T16:10:15.372Z",
      "updatedAt": "2023-03-23T16:10:15.372Z"
    },
    {
      "id": "65b6bcda-99e0-4658-ac5d-98f3752aceda",
      "userId": "6fef5a6d-b659-4c54-be1b-61af27c1e0e4",
      "productId": "998d7b3e-27c3-4949-a80b-944172d128e5",
      "createdAt": "2023-03-23T19:27:16.910Z",
      "updatedAt": "2023-03-23T19:27:16.910Z"
    }
  ]
}
```

## Adding product to cart
`post /cart/id`

- login and put token in bearer auth
- product id must be available
- note: `token is required`
-put the is of the product you want in parameters 
you will get this response 

```
{
  "value": {
    "message": "added to cart successfully",
    "data": {
      "id": "60d74375-540d-4f9f-9e2c-7afa4d09b8ef",
      "userId": "13089152-d7d3-405d-84bc-0f098efa1f5c",
      "products": [
        {
          "id": "42680429-46a2-43bd-ad08-5db59675b98c",
          "name": "bed sheets",
          "image": "http://res.cloudinary.com/du0vsc2pt/image/upload/v1679471871/dm23aha2zl9pihx3j4vi.jpg",
          "price": 800,
          "Ptotal": 8000,
          "quantity": 10
        },
        {
          "id": "1cc2f219-81a4-48fb-a98a-8c574416a320",
          "name": "shoes",
          "image": "http://res.cloudinary.com/du0vsc2pt/image/upload/v1679470404/pfyewd7rto4mtvle3viw.png",
          "quantity": 7,
          "price": 90,
          "Ptotal": 630
        }
      ],
      "total": 8630,
      "createdAt": "2023-03-22T11:09:34.796Z",
      "updatedAt": "2023-03-22T14:41:26.195Z"
    }
  }
}

```


## Deleting product from cart
`delete /cart/id`

- login and put token in bearer auth
- product id must be available
- note: `token is required`
-put the is of the product you want to delete in parameters 
you will get this response 

```
{
  "value": {
    "message": "removed product from cart  successfully"
  }
}

```

## viewing your cart
`get /cart`

- login and put token in bearer auth
- there must be cart created by you if not first create cart by adding product into cart and come back to view
- note: `token is required`
- then excute
you will get your cart like this response 

```
{
  "value": {
    "message": "added to cart successfully",
    "data": {
      "id": "60d74375-540d-4f9f-9e2c-7afa4d09b8ef",
      "userId": "13089152-d7d3-405d-84bc-0f098efa1f5c",
      "products": [
        {
          "id": "42680429-46a2-43bd-ad08-5db59675b98c",
          "name": "bed sheets",
          "image": "http://res.cloudinary.com/du0vsc2pt/image/upload/v1679471871/dm23aha2zl9pihx3j4vi.jpg",
          "price": 800,
          "Ptotal": 8000,
          "quantity": 10
        },
        {
          "id": "1cc2f219-81a4-48fb-a98a-8c574416a320",
          "name": "shoes",
          "image": "http://res.cloudinary.com/du0vsc2pt/image/upload/v1679470404/pfyewd7rto4mtvle3viw.png",
          "quantity": 7,
          "price": 90,
          "Ptotal": 630
        }
      ],
      "total": 8630,
      "createdAt": "2023-03-22T11:09:34.796Z",
      "updatedAt": "2023-03-22T14:41:26.195Z"
    }
  }
}

```

## as admin you can view all carts created by all users
`get /cart/all`

- login as admin and put token in bearer auth
- there must be soome carts created by users 
- note: `adminToken is required`
- note: any other token can't view all carts created by users
- then excute
you will get all carts created by users like this response 

```
{
  "value": {
    "message": "Here are all the carts",
    "data": [
      {
        "id": "1e6a5624-85b5-46e5-8273-663e09462345",
        "userId": "d8ccf7d9-b4aa-49ef-a3c9-4c04006a8803",
        "products": [
          {
            "id": "76cf772d-8100-4fc7-a90d-292e12d68263",
            "name": "Unbranded Plastic Car",
            "image": "https://loremflickr.com/640/480",
            "price": 741,
            "Ptotal": 2964,
            "quantity": 4
          },
          {
            "id": "fe948ec7-72f1-4369-a7be-458a8464d4c7",
            "name": "Intelligent Frozen Bacon",
            "image": "https://loremflickr.com/640/480",
            "price": 325,
            "Ptotal": 4225,
            "quantity": 13
          }
        ],
        "total": 7189,
        "createdAt": "2023-03-23T13:12:54.345Z",
        "updatedAt": "2023-03-23T13:13:47.249Z"
      },
      {
        "id": "8cc05f93-ac3d-42a0-a55c-3ab1cd3c2341",
        "userId": "4e97e20a-cf0d-46b1-b09c-163b0a493405",
        "products": [
          {
            "id": "fe948ec7-72f1-4369-a7be-458a8464d4c7",
            "name": "Intelligent Frozen Bacon",
            "image": "https://loremflickr.com/640/480",
            "price": 325,
            "Ptotal": 3250,
            "quantity": 10
          },
          {
            "id": "76cf772d-8100-4fc7-a90d-292e12d68263",
            "name": "Unbranded Plastic Car",
            "image": "https://loremflickr.com/640/480",
            "price": 741,
            "Ptotal": 14820,
            "quantity": 20
          }
        ],
        "total": 18070,
        "createdAt": "2023-03-23T16:05:03.779Z",
        "updatedAt": "2023-03-23T16:05:41.462Z"
      },
      {
        "id": "eaae06de-78d1-4dc5-a635-4a8591f7c7f6",
        "userId": "6a4d9add-7976-48bf-a637-d5d177776086",
        "products": [
          {
            "id": "76cf772d-8100-4fc7-a90d-292e12d68263",
            "name": "Unbranded Plastic Car",
            "image": "https://loremflickr.com/640/480",
            "price": 741,
            "Ptotal": 3705,
            "quantity": 5
          },
          {
            "id": "fe948ec7-72f1-4369-a7be-458a8464d4c7",
            "name": "Intelligent Frozen Bacon",
            "image": "https://loremflickr.com/640/480",
            "price": 325,
            "Ptotal": 3250,
            "quantity": 10
          }
        ],
        "total": 6955,
        "createdAt": "2023-03-23T15:03:43.687Z",
        "updatedAt": "2023-03-23T15:40:19.954Z"
      }
    ]
  }
}

```

## PUBLIC CHAT

`get /chat/all`

- login  and put token in bearer auth 
- note: `Token is required`
- then excute
you will get all messages created by other users like this response 

```
{
  "message": "Fetched  messages",
  "messages": [
    {
      "id": "1d7ed6d5-d4ae-4c09-8b97-ed50ff3ed048",
      "room": "brogrammers",
      "message": "hy",
      "createdAt": "2023-03-25T09:20:20.481Z",
      "updatedAt": "2023-03-25T09:20:20.481Z",
      "userId": "00ddd0e0-1fda-41f8-89bc-fc402ff64bee",
      "user": {
        "username": "John Doe"
      }
    },
    {
      "id": "99b6997d-9f6b-41ad-9916-32876e310055",
      "room": "brogrammers",
      "message": "Hello, world!",
      "createdAt": "2023-03-25T08:19:34.171Z",
      "updatedAt": "2023-03-25T08:19:34.171Z",
      "userId": "00ddd0e0-1fda-41f8-89bc-fc402ff64bee",
      "user": {
        "username": "John Doe"
      }
    },
```

`post /chat/message`

Example of request body:

```
{
  "message": "Hey",
}
```
- login  and put token in bearer auth 
- note: `Token is required`
- then excute
you will get this response 

```
{
  "message": "Message sent.",
  "messages": {
    "id": "7f2765c7-7abb-4662-81df-b1f5f4a6bee0",
    "room": "brogrammers",
    "userId": "00ddd0e0-1fda-41f8-89bc-fc402ff64bee",
    "message": "Hey",
    "updatedAt": "2023-03-25T11:38:57.712Z",
    "createdAt": "2023-03-25T11:38:57.712Z"
  }
}