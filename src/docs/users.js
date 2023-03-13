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
 */

/**
* @swagger
* /users/update-password:
*   put:
*     summary: Update user's password
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
*             id:
*               type: integer
*               description: User's ID
*               example: 6
*             currentPassword:
*               type: string
*               description: User's current password
*               example: Password@123
*             newPassword:
*               type: string
*               description: User's new password
*               example: newPassword@123
*     responses:
*       200:
*         description: Password updated successfully
*         schema:
*           type: object
*           properties:
*             message:
*               type: string
*               example: Password updated successfully
*             data:
*               type: object
*               $ref: '#/definitions/User'
*       400:
*         description: Invalid request body
*       500:
*         description: Internal server error
*       default:
*         description: Unexpected error
*/

