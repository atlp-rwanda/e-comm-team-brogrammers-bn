/**
 * @swagger
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
 *         '200':
 *           description: successful operation
 *         '400':
 *           description: Bad request
 *         '500':
 *           description: server error
 *
 * /users/login:
 *   post:
 *     summary: Logs in a user with email and password
 *     tags:
 *         - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
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
 *                 email:
 *                   type: string
 *                 id:
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
 * @swagger
 * /users/Create-admin/{email}:
 *   patch:
 *     summary: Make an existing user an admin.
 *     tags:
 *         - Users
 *     security:
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
 */

/**
* @swagger
* /users/change-password:
*   patch:
*     summary: change user's password
*     tags:
*       - Users
*     parameters:
*       - in: body
*         name: Update Password
*         description: Object containing user's current password and new password
*         required: true
*         schema:
*           type: object
*           properties:
*             email:
*               type: string
*               description: User email
*               example: ange@gmail.com.com
*             oldPassword:
*               type: string
*               description: User's current password
*               example: Password@123
*             newPassword:
*               type: string
*               description: User's new password
*               example: newPassword@123
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
*/
