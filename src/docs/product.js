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
 *        '201':
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
 * /products/categories:
 *    get:
 *       tags:
 *         - Products
 *       summary: get all categories
 *       description: each person can see the product's categories
 *       responses:
 *        '200':
 *          description: get categories successfully
 *          content:
 *            application/json:
 *              schema:
 *                type: array
 *                description: all categories
 *                example: [{...: ...}, {...: ...}]
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
 *    get:
 *       tags:
 *         - Products
 *       summary: get one product
 *       description: the seller or a user can get one product is they are available
 *       parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: id of the product
 *          schema:
 *            type: string
 *       responses:
 *        '200':
 *          description: get product successfully
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
 *                    description: id is not supposed to be null
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
 * /products:
 *   get:
 *     summary: get all products
 *     tags:
 *         - Products
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
 *       '200':
 *         description: Product retrieved Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *       '500':
 *         description: Server error!
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 * /products/collection:
 *   get:
 *     summary: get all products by a seller
 *     tags:
 *         - Products
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     parameters:
 *       - name: limit
 *         in: query
 *         type: integer
 *         format: int32
 *         description: The maximum number of users to retrieve per page.
 *       - name: page
 *         in: query
 *         type: integer
 *         format: int32
 *         description: The page number to retrieve. Default value is 1
 *     responses:
 *       '200':
 *         description: You have Successfully retrieved products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *       '401':
 *         description: User not logged In
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * /products/buyer/{id}:
 *    get:
 *      tags:
 *         - Products
 *      summary: buyer get any product by id
 *      description: the buyer can get any product by id from any seller collection
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: id of the product
 *          schema:
 *            type: string
 *      security:
 *        - {}
 *        - bearerAuth: []
 *      responses:
 *       '200':
 *         description: You have Successfully retrieved products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *       '404':
 *         description: Product not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '401':
 *         description: User not logged In
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 *
 * /products/seller/{id}:
 *    get:
 *      tags:
 *         - Products
 *      summary: seller get any product by id from his collection
 *      description: the seller can get any product by id from his collection only
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: id of the product
 *          schema:
 *            type: string
 *      security:
 *        - {}
 *        - bearerAuth: []
 *      responses:
 *       '200':
 *         description: You have Successfully retrieved products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 product:
 *                   type: object
 *       '404':
 *         description: Product not found in your collection
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '401':
 *         description: User not logged In
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *
 * /products/delete/{id}:
 *    delete:
 *       tags:
 *         - Products
 *       summary: delete a product by ID
 *       description: the seller can delete a product by ID from his/her collection
 *       parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: id of the product
 *          schema:
 *            type: string
 *       security:
 *        - bearerAuth: []
 *       responses:
 *        '200':
 *          description: product successfully deleted
 *        '400':
 *          description: product doesn't exist
 * /products/{id}/available:
 *    patch:
 *       tags:
 *         - Products
 *       summary: seller change availability
 *       description: the seller can change product availablity
 *       security:
 *        - {}
 *        - bearerAuth: []
 *       parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          description: id of the product
 *          schema:
 *            type: string
 *       responses:
 *        '200':
 *          description: product availability changed
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
 *                    description: id is not supposed to be null
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
 *                    description: error message
 * /products/search/query:
 *   get:
 *     summary: Search for a product
 *     tags:
 *       - Products
 *     parameters:
 *       - name: q
 *         in: query
 *         description: Product name
 *         schema:
 *           type: string
 *       - name: min
 *         in: query
 *         description: Minimum product price
 *         schema:
 *           type: number
 *       - name: max
 *         in: query
 *         description: Maximum product price
 *         schema:
 *           type: number
 *       - name: category
 *         in: query
 *         description: Product category
 *         schema:
 *           type: string
 *       - name: page
 *         in: query
 *         description: page for pagination
 *         schema:
 *           type: number
 *       - name: limit
 *         in: query
 *         description: limit of items for pagination
 *         schema:
 *           type: number
 *     responses:
 *       "200":
 *         description: OK
 *       "400":
 *         description: Bad Request
 *       "500":
 *         description: Internal Server Error
 */
