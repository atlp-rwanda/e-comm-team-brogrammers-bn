/**
 * @swagger
 * /products/:
 *    post:
 *       tags:
 *         - Products
 *       summary: create new product
 *       description: the seller can create new product
 *       security:
 *        - bearerAuth: []
 *       requestBody:
 *         description: new user information
 *         content:
 *           multipart/form-data:
 *              schema:
 *                 type: object
 *                 required:
 *                    - name
 *                    - price
 *                    - quantity
 *                    - images
 *                 properties:
 *                    name:
 *                      type: string
 *                      example: shoe
 *                    description:
 *                      type: string
 *                      example: new nike shoes
 *                    price:
 *                      type: number
 *                      example: 200
 *                    quantity:
 *                      type: number
 *                      example: 20
 *                    category:
 *                      type: number
 *                      example: 2
 *                    expdate:
 *                      type: date
 *                      example: mm-dd-yyyy
 *                    images:
 *                      type: array
 *                      items:
 *                        type: string
 *                        format: binary
 *       responses:
 *        '200':
 *          description: product successfully created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: A success message.
 *                  value:
 *                    type: object
 *                    description: created product
 *        '400':
 *          description: bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: A success message.
 *                  error:
 *                    type: object
 *                    description: created product
 *        '401':
 *          description: not authorized
 *        '500':
 *          description: server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: A success message.
 *                  error:
 *                    type: object
 *                    description: created product
 * /products/{id}:
 *    patch:
 *       tags:
 *         - Products
 *       summary: update new product
 *       description: the seller can create update product in his/her collection
 *       parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: id of the product
 *          schema:
 *            type: string
 *       security:
 *        - bearerAuth: []
 *       requestBody:
 *         description: new user information
 *         content:
 *           multipart/form-data:
 *              schema:
 *                 type: object
 *                 properties:
 *                    name:
 *                      type: string
 *                      example: shoe
 *                    description:
 *                      type: string
 *                      example: new nike shoes
 *                    price:
 *                      type: number
 *                      example: 200
 *                    quantity:
 *                      type: number
 *                      example: 20
 *                    category:
 *                      type: number
 *                      example: 2
 *                    expdate:
 *                      type: date
 *                      example: mm-dd-yyyy
 *                    images:
 *                      type: array
 *                      items:
 *                        type: string
 *                        format: binary
 *       responses:
 *        '200':
 *          description: product successfully created
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: A success message.
 *                  value:
 *                    type: object
 *                    description: created product
 *        '400':
 *          description: bad request
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: A success message.
 *                  error:
 *                    type: object
 *                    description: created product
 *        '401':
 *          description: not authorized
 *        '500':
 *          description: server error
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  message:
 *                    type: string
 *                    description: A success message.
 *                  error:
 *                    type: object
 *                    description: created product
 *
 */
