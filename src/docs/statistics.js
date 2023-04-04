/**
*@swagger
* /users/stats:
*   get:
*     summary: seller's statistics!
*     tags:
*       - Statistic
*     security:
*       - bearerAuth: []
*     parameters:
*       - name: start
*         in: query
*         description: start date to compare the statistics
*         type: date
*         example: yyyy-mm-dd
*       - name: end
*         in: query
*         description: the end date to compare the statistics
*         type: date
*         example: yyyy-mm-dd
*     responses:
*       200:
*         description: here is your statistic
*         schema:
*           type: object
*           properties:
*             products:
*               type: string
*             revenue:
*               type: string
*       '500':
*         description: Internal server error.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 Error:
*                   type: string
*                   description: error message.
*@swagger
* /users/stats/graph/{range}:
*   get:
*     summary: seller's statistics graph!
*     tags:
*       - Statistic
*     security:
*       - bearerAuth: []
*     parameters:
*       - name: range
*         in: path
*         example: year/month/week,day
*     responses:
*       200:
*         description: here is graph showing you your statistics
*         schema:
*           type: object
*           properties:
*             products:
*               type: string
*             revenue:
*               type: string
*       '500':
*         description: Internal server error.
*         content:
*           application/json:
*             schema:
*               type: object
*               properties:
*                 Error:
*                   type: string
*                   description: error message.
*/
