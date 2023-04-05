/**
* @swagger
* /wishlist/{id}:
*   post:
*     summary: Adding product to wishlist
*     tags:
*         - Wishlist
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The id of the product to be put in wishlist
*         schema:
*           type: string
*     responses:
*       '200':
*         description: product was added to the wishlist
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: A success message.
*       '404':
*         description: product not found
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
*@swagger
* /wishlist/:
*   get:
*     summary: getting  wishlist of a user
*     tags:
*         - Wishlist
*     security:
*       - bearerAuth: []
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
*@swagger
* /wishlist/all:
*   get:
*     summary: getting  wishlist of a all users
*     tags:
*         - Wishlist
*     security:
*       - bearerAuth: []
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
*         description: You have Successfully all wishlists for all users
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 product:
*                   type: object
*       '401':
*         description: User not admin
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*@swagger
* /wishlist/clear:
*   patch:
*     summary: clearing wishlist of user
*     tags:
*         - Wishlist
*     security:
*       - bearerAuth: []
*     responses:
*       '200':
*         description: You have Successfully cleared your wsihlist
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 product:
*                   type: object
*       '401':
*         description: User not admin
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
* @swagger
* /wishlist/{id}:
*   delete:
*     summary: removing product from wishlist
*     tags:
*         - Wishlist
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The id of the product to bedeleted from wishlist
*         schema:
*           type: string
*     responses:
*       '200':
*         description: productproduct deleted from wishlist
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: A success message.
*       '404':
*         description: product not found
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
*                   description: The error message
*/
