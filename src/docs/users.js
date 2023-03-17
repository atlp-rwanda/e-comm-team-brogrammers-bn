/* eslint-disable max-len */
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
 *
 * tags:
 *   name: MFA
 *   description: Endpoints for enabling, disabling, and verifying MFA for users.
 *
 * securityDefinitions:
 *   JWT:
 *     type: apiKey
 *     name: Authorization
 *     in: header
 *
 * /users/enable-mfa:
 *   post:
 *     security:
 *       - JWT: []
 *     summary: Enable MFA for the currently logged in user.
 *     tags: [MFA]
 *     responses:
 *       200:
 *         description: MFA enabled successfully.
 *       403:
 *         description: User not logged in.
 *
 * /users/disable-mfa:
 *   post:
 *     security:
 *       - JWT: []
 *     summary: Disable MFA for the currently logged in user.
 *     tags: [MFA]
 *     responses:
 *       200:
 *         description: MFA disabled successfully.
 *       403:
 *         description: User not logged in.
 *
 * /users/verify-mfa:
 *   post:
 *     summary: Verify the validity of the user's MFA code.
 *     tags: [MFA]
 *     parameters:
 *       - name: mfa_code
 *         in: body
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: MFA code is valid. JWT token is returned.
 *         schema:
 *           type: object
 *           properties:
 *             token:
 *               type: string
 *       403:
 *         description: MFA code is invalid or expired.
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
 *              schema:
 *                 type: object
 *                 required:
 *                    - email
 *                    - password
 *                 properties:
 *                    email:
 *                      type: string
 *                      example: test3@email.com
 *                    password:
 *                      type: string
 *                      example: Benn@123
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
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: body
*         name: Update Password
*         description: Object containing user's current password and new password
*         required: true
*         schema:
*           type: object
*           properties:
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
