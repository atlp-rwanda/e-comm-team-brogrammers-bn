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
  "avatar": "https://loremflickr.com/640/480",
  "cover_image": "https://loremflickr.com/640/480",
  username: 'luca'
  email: 'luca@gmail.com',  
  gender: 'none',
  role: 'buyer'
}
```

### change profile

`PATCH /users/profile`

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
  "avatar": "https://loremflickr.com/640/480",
  "cover_image": "https://loremflickr.com/640/480",
  "username: "new luca",
  "email": "newluca@gmail.com",
  "gender": "none",
  "role": "buyer"
}
```

`change the token because some data in it was changed too`

### change profile picture

`PATCH /users/profile/avatar`
used to update the profile picture

Example of request body (form data):
```
{
  "image: "<file>"
}
```
- Example Response: 
```
{
  "avatar": "https://loremflickr.com/640/480",
  "cover_image": "https://loremflickr.com/640/480",
  "username: "new luca",
  "email": "newluca@gmail.com",
  "gender": "none",
  "role": "buyer"
}
```

### change profile cover picture
used to update the profile cover picture

`PATCH /users/profile/cover-image`

Example of request body (form data):
```
{
  "image: "<file>"
}
```
- Example Response: 
```
{
  "avatar": "https://loremflickr.com/640/480",
  "cover_image": "https://loremflickr.com/640/480",
  "username: "new luca",
  "email": "newluca@gmail.com",
  "gender": "none",
  "role": "buyer"
}
```

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
    "avatar": "https://loremflickr.com/640/480",
    "cover_image": "https://loremflickr.com/640/480",
    "username": "Ange She",
    "email": "mary@gmail.com",
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
    "email":"mary@gmail.com",
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
```

## A user should be able to mark one/all notifications as read (needs login)
```
 - To mark notification as read make the following request
    - `POST /notification/read/{notificationId}`
 - To mark notification as unread make the following request
    - `POST /notification/unread/{notificationId}`
 - To mark all single user notifications as read make the following request
    - `POST /notification/read/all`

```

## PAYMENT

`get /payment/order/{orderID}`

- login  and put token in bearer auth 
- note: `Token is required`
- then excute
here the user get the url for payment and he/she get the items to be paid

request body
```
{
  "success": "http://www.example.com/success",
  "fail": "http://www.example.com/success"
}
```
the `success` is the url that will be redirected to when the payment is complete,

then the `fail` is when payment if failed due to some problems

the response will be like
```
{
  "items": [arrays of items],
  "url": "<the link to pay the your order>"
}
```
you'll put the link to the browser in order to pay

## SELLER STATISTICS 

`get /users/stats`

get the preview on the link under here
### [get preview](https://test-dashhbord-oocymqrqi-blackd44.vercel.app/)

- login as user or admin  and put token in bearer auth 
- note: `Admin or Seller Token is required`
- set `start` and `end` date to get statistics between that time
- then excute

you will get:

1. total revenue
2. number of orders
3. products sold
4. money made in a time frame
5. and top-selling products will be displayed as the first according money made for single product

and you will get it as the following response:

```
{
  "products": [
    {
      "id": "a30e1ccb-399f-4960-888f-2831da81bd29",
      "images": [
        "https://loremflickr.com/640/480",
        "https://loremflickr.com/640/480",
        "https://loremflickr.com/640/480"
      ],
      "name": "Unbranded Steel Shoes",
      "description": "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
      "quantity": 16673,
      "exp_date": "2024-03-05T20:39:19.004Z",
      "price": 290,
      "createdAt": "2023-04-03T14:42:33.566Z",
      "soldQuantity": 233177,
      "soldAmount": 67621330
    },
    {
      "id": "7fbed603-ef41-49a4-8a2d-1f9effa92f7c",
      "images": [
        "https://loremflickr.com/640/480",
        "https://loremflickr.com/640/480",
        "https://loremflickr.com/640/480"
      ],
      "name": "Intelligent Plastic Keyboard",
      "description": "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
      "quantity": 25382,
      "exp_date": "2023-06-09T17:20:20.082Z",
      "price": 600,
      "createdAt": "2023-04-03T14:42:33.567Z",
      "soldQuantity": 4164,
      "soldAmount": 2498400
    }
  ],
  "revenue": {
    "total": 70119730,
    "items": 237341
  }
}
```

`get /users/stats/graph/{range}`

here range must be `year/month/week/day` and it returns statistics of seller in that range on graph!

and you will get it as the following response:

```
[
  null,
  null,
  null,
  {
    "name": "Apr",
    "values": [
      {
        "id": "a30e1ccb-399f-4960-888f-2831da81bd29",
        "images": [
          "https://loremflickr.com/640/480",
          "https://loremflickr.com/640/480",
          "https://loremflickr.com/640/480"
        ],
        "name": "Unbranded Steel Shoes",
        "description": "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
        "quantity": 16673,
        "exp_date": "2024-03-05T20:39:19.004Z",
        "price": 290,
        "createdAt": "2023-04-03T14:42:33.566Z",
        "soldQuantity": 233177,
        "soldAmount": 67621330
      },
      {
        "id": "7fbed603-ef41-49a4-8a2d-1f9effa92f7c",
        "images": [
          "https://loremflickr.com/640/480",
          "https://loremflickr.com/640/480",
          "https://loremflickr.com/640/480"
        ],
        "name": "Intelligent Plastic Keyboard",
        "description": "New ABC 13 9370, 13.3, 5th Gen CoreA5-8250U, 8GB RAM, 256GB SSD, power UHD Graphics, OS 10 Home, OS Office A & J 2016",
        "quantity": 25382,
        "exp_date": "2023-06-09T17:20:20.082Z",
        "price": 600,
        "createdAt": "2023-04-03T14:42:33.567Z",
        "soldQuantity": 4164,
        "soldAmount": 2498400
      }
    ],
    "totalAmount": 70119730,
    "items": 237341
  }
]
```
## Pagination

`/products?page=3&limit=3`
sample endpoint to get paginated results 
here is sample output
```
{
  "message": "All products retrieved successfully",
  "allproducts": {
    "next": {
      "page": 4,
      "limit": 3
    },
    "previous": {
      "page": 2,
      "limit": 3
    },
    "results": [
      {
        "id": "578be15d-2a74-4811-bd20-43bb4ca3c56f",
        "images": [
          "http://res.cloudinary.com/du0vsc2pt/image/upload/v1680687540/sidqmawc0ioqqy0xctuj.png",
          "http://res.cloudinary.com/du0vsc2pt/image/upload/v1680687543/xod2ygzvq2dckyhjvdjc.png"
        ],
        "name": "shoes",
        "description": "new shoes on the market",
        "quantity": 30,
        "exp_date": "2030-03-19T22:00:00.000Z",
        "available": true,
        "price": 100,
        "category": 1,
        "createdAt": "2023-04-05T09:39:03.693Z",
        "updatedAt": "2023-04-05T09:39:03.693Z",
        "seller": null
      },
      {
        "id": "82af4a14-e5fa-47f0-a353-3921e117d063",
        "images": [
          "https://loremflickr.com/640/480",
          "https://loremflickr.com/640/480",
          "https://loremflickr.com/640/480"
        ],
        "name": "Incredible Fresh Sausages",
        "description": "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
        "quantity": 59048,
        "exp_date": "2023-12-31T15:14:54.545Z",
        "available": true,
        "price": 545,
        "category": 1,
        "createdAt": "2023-04-05T09:39:16.625Z",
        "updatedAt": "2023-04-05T09:39:16.625Z",
        "seller": null
      },
      {
        "id": "54348447-2ade-406f-a2c4-37f3bd8e26aa",
        "images": [
          "http://res.cloudinary.com/du0vsc2pt/image/upload/v1680687606/om87i1sdbgqaojp2jqhz.png",
          "http://res.cloudinary.com/du0vsc2pt/image/upload/v1680687609/rnnumvlhhpfaljwvet1w.png"
        ],
        "name": "shoes",
        "description": "new shoes on the market",
        "quantity": 30,
        "exp_date": "2030-03-19T22:00:00.000Z",
        "available": true,
        "price": 100,
        "category": 1,
        "createdAt": "2023-04-05T09:40:09.819Z",
        "updatedAt": "2023-04-05T09:40:09.819Z",
        "seller": null
      }
    ]
  }
}
```




# Database

there are two ways to run the database backup in the project

1. ## use of terminal

- ### backup
by using npm scripts you can start the backup of the project, it will use clone jobs as it is in the environment variables of the project.

run: `npm run pgback-up` this will start the backup in within each time set in the environment variable file

- ### restore
by using npm scripts you can restore the project database, it uses environment variables to get the database to restore and get the backup file to use in restoring.

run `npm run pgrestore <filename>` this will restore the database by the file in the terminal

⚠️always make sure that the file is in the backup folder or otherwise it won't work

2. ## use of routes

the second way is by the use of routes where the admin put the endpath and send a request for getting and restoring the database, but the backup start when the project is started

⚠️always make sure you are an admin

- ### Getting all backups

`GET /database/backups`

by using routes the admin can send the request to get all backups the project have

here is the example of response:

```
{
  "message": "here is your backups",
  "files": [
    "backup-20230405-171330.sql",
    "backup-20230405-171230.sql"
  ]
}
```

- ### Restoring the recent backup

`GET /database/restore`

by using routes the admin can send the request to restore the recent backups the project have, this will change the database in real time so the project will continue running.

here is the example of response:

```
{
  "message": "backups restored",
  "backup": "backup-20230405-190600.sql"
}
```
where `backup-20230405-190600.sql` is the recent backup file

- ### Restoring backup file

`GET /database/restore/:filename`

by using routes the admin can send the request to restore the backup file the project have by it's name, this will change the database in real time so the project will continue running.

here is the example of response:
```
path: /database/restore/backup-20230405-190600.sql
```

```
{
  "message": "backups restored",
  "backup": "backup-20230405-190600.sql"
}
```
where `backup-20230405-190600.sql` is the recent backup file