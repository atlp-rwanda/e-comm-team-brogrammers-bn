/**
* @swagger
* /cart/{id}:
*   post:
*     summary: adding product to cart
*     tags:
*         - Cart
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The id of the product to be put in cart
*         schema:
*           type: string
*     requestBody:
*       description:  information
*       content:
*         application/json:
*            schema:
*               type: object
*               properties:
*                  quantities:
*                    type: number
*                    example: 4
*     responses:
*       '200':
*         description: You have Successfully deleted the product from cart
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
*@swagger
* /cart/{id}:
*   delete:
*     summary: deleting product from cart
*     tags:
*         - Cart
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The id of the product to be put in cart
*         schema:
*           type: string
*     responses:
*       '200':
*         description: You have Successfully deleted the product from cart
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
* @swagger
* /cart:
*   get:
*     summary: view all item in the cart
*     tags:
*       - Cart
*     security:
*       - bearerAuth: []
*     responses:
*       '200':
*         description: Returns the current user's cart
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Hey Here is your cart!
*                 data:
*                   type: object
*                   description: The cart data
*       '401':
*         description: User not logged in
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Unauthorized
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
* @swagger
* /cart/all:
*   get:
*     summary: Get all carts
*     tags:
*       - Cart
*     security:
*       - bearerAuth: []
*     responses:
*       '200':
*         description: Returns all carts
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Here are all the carts created by users
*                 data:
*                   type: array
*                   items:
*                     type: object
*                     description: A cart object
*       '401':
*         description: User not logged in
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   example: Unauthorized
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
