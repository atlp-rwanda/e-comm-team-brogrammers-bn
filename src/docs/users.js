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
 */
