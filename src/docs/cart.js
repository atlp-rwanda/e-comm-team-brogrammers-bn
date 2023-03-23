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
*
*
*@swagger
* /cart:
*   delete:
*     summary: Clear buyer's cart
*     description: reset the buyer cart and return a success message
*     tags:
*         - Cart
*     security:
*       - bearerAuth: []
*     responses:
*       '200':
*         description: Cart cleared successfully
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: Cart cleared confirmation message
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
*/
