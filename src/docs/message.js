/**
* @swagger
* /chat/message:
*   post:
*     summary: adding a message to a chat
*     tags:
*         - Chat
*     security:
*       - bearerAuth: []
*     requestBody:
*       description:  information
*       content:
*         application/json:
*            schema:
*               type: object
*               properties:
*                  message:
*                    type: string
*                    example: Hey
*     responses:
*       '200':
*         description: Message sent.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 message:
*                   type: string
*       '401':
*         description: User not logged In
*       '500':
*         description: Internal server error occurred.
*
*@swagger
* /chat/all:
*   get:
*     summary: Get all messages in a chat
*     tags:
*         - Chat
*     security:
*       - bearerAuth: []
*     responses:
*       '200':
*         description: Fetched  messages
*       '401':
*         description: User not logged In
*       '500':
*         description: Internal server error occurred.
*/
