/**
* @swagger
* /notification/{id}:
*   delete:
*     summary: deleting one notification
*     tags:
*         - Notification
*     security:
*       - bearerAuth: []
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The id notification to be deleted
*         schema:
*           type: string
*     responses:
*       '202':
*         description: notification have been successfully deleted
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*                   description: A success message.
*       '404':
*         description: notification not found
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
* /notification/:
*   get:
*     summary: getting all notification of a user
*     tags:
*         - Notification
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
*       '200':
*         description: You have Successfully retrieved all notifications
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
* /notification/clear:
*   patch:
*     summary: clearing user notifications
*     tags:
*         - Notification
*     security:
*       - bearerAuth: []
*     responses:
*       '202':
*         description: all notifications successfully cleared
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 product:
*                   type: object
*       '401':
*         description: not logged in
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*/
