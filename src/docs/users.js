/* eslint-disable max-len */
/**
 * @swagger
 *
 * /users/signup:
 *    post:
 *       tags:
 *         - Users
 *       summary: create new user
 *       description: add a new user's informations
 *       operationId: signup
 *       requestBody:
 *         description: new user information
 *         content:
 *           application/json:
 *              schema:
 *                 type: object
 *                 required:
 *                    - username
 *                    - email
 *                    - password
 *                 properties:
 *                    username:
 *                      type: string
 *                      example: test3
 *                    email:
 *                      type: string
 *                      example: test3@email.com
 *                    password:
 *                      type: string
 *                      example: Benn@123
 *                    gender:
 *                      type: string
 *       responses:
 *         '201':
 *           description: successful operation
 *         '400':
 *           description: Bad request
 *         '500':
 *           description: server error
 *
 *
 * /users/login:
 *   post:
 *     summary: Login a user and return a JWT token.
 *     tags:
 *       - Users
 *     requestBody:
 *         description: new user information
 *         content:
 *           application/json:
 *                schema:
 *                  type: object
 *                  required:
 *                    - email
 *                    - password
 *                  properties:
 *                    email:
 *                      type: string
 *                      example: me@gmail.com
 *                    password:
 *                      type: string
 *                      example: 123@Pass
 *     responses:
 *       200:
 *         description: Successfully authenticated. JWT token is returned or message to check inbox for MFA code.
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *             message:
 *               type: string
 *       401:
 *         description: Incorrect email or password.
 *       403:
 *         description: User email is not verified
 *
 *       '200':
 *         description: Successfully logged in the user or sent mfa code
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 email:
 *                   type: string
 *       '401':
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '403':
 *         description: Email not verified
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 *
 * /users/profile:
 *   get:
 *     summary: get the user profile
 *     tags:
 *         - Users
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successfully logged in the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 role:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 cover-image:
 *                   type: string
 *       '401':
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 *   patch:
 *     summary: change the user profile
 *     tags:
 *         - Users
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                   type: string
 *               email:
 *                   type: string
 *               gender:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Successfully logged in the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 role:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 cover-image:
 *                   type: string
 *       '401':
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * /users/profile/avatar:
 *   patch:
 *     summary: change the user avatar
 *     tags:
 *         - Users
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     requestBody:
 *         content:
 *           multipart/form-data:
 *              schema:
 *                 type: object
 *                 required:
 *                    - image
 *                 properties:
 *                    image:
 *                      type: string
 *                      format: binary
 *                      description: the avatar image file
 *     responses:
 *       '200':
 *         description: Successfully changed the avatar image for logged user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 role:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 cover-image:
 *                   type: string
 *       '401':
 *         description: Invalid token or user don't have access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * /users/profile/cover-image:
 *   patch:
 *     summary: change the user cover picture
 *     tags:
 *         - Users
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     requestBody:
 *         content:
 *           multipart/form-data:
 *              schema:
 *                 type: object
 *                 required:
 *                    - image
 *                 properties:
 *                    image:
 *                      type: string
 *                      format: binary
 *                      description: the cover image file
 *     responses:
 *       '200':
 *         description: Successfully changed the cover image for logged user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 gender:
 *                   type: string
 *                 role:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                 cover-image:
 *                   type: string
 *       '401':
 *         description: Invalid token or user don't have access
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 *
 * @swagger
 * /users/create-admin/{email}:
 *   patch:
 *     summary: Make an existing user an admin.
 *     tags:
 *         - Users
 *     security:
 *       - {}
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: The email of the user to make an admin.
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User was successfully made an admin.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '404':
 *         description: The user with the specified email was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   description: An error message.
 *       '500':
 *         description: Internal server error occurred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: string
 *                   description: The error message.
 *
 * @swagger
 * /users/role/{email}:
 *   patch:
 *     summary: Assigning role to a given user.
 *     tags:
 *         - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         description: Email of the user you want to set a role to.
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                   type: string
 *     responses:
 *       '200':
 *         description: Role assigned to the user successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *       '404':
 *         description: The user with that id was not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: integer
 *                   example: 404
 *                 message:
 *                   type: string
 *                   description: error message.
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: string
 *                   description: error message.
 */

/**
 * @swagger
 * /users/change-password:
 *   patch:
 *     summary: change user's password
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: Object containing user's current password and new password
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 description: User's current password
 *                 example: Password@123
 *               newPassword:
 *                 type: string
 *                 description: User's new password
 *                 example: newPassword@123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Password changed successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 *       default:
 *         description: Unexpected error
 * @swagger
 * /users/disable/{userId}:
 *   patch:
 *     summary: Disable a user account
 *     tags:
 *       - Admin
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name:  userId
 *     requestBody:
 *       description: You violated our terms of service
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                reason:
 *                  type: string
 *                  description: Password changed successfully
 *                  example: User account disabled successfully
 *     responses:
 *       200:
 *         description: User account disabled successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: User account disabled successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 *       default:
 *         description: Unexpected error
 */

/**
 * @swagger
 * /users/logout:
 *   get:
 *     summary: User logout!
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: You logged out successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: you logged out successfully
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: string
 *                   description: error message.
 * @swagger
 * /logs/all:
 *   get:
 *     summary: Get user logs
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *         description: The maximum number of results to retrieve per page.
 *       - name: page
 *         in: query
 *         type: integer
 *         format: int32
 *         description: The page number to retrieve. Default value is 1
 *     responses:
 *       200:
 *         description: Retrieved logs successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Retrieved logs successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: string
 *                   description: error message.
 * @swagger
 * /logs/{id}:
 *   get:
 *     summary: Get user logs by its id
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: id of the log
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Retrieved logs successfully
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               example: Retrieved logs successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 Error:
 *                   type: string
 *                   description: error message.
 */
