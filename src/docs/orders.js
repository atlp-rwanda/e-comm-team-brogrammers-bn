/**
 * @swagger
 * tags:
 *   name: checkout
 */
/**
 * @swagger
 * /checkout:
 *   get:
 *     summary: Get all orders of a user
 *     tags: [checkout]
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /checkout/{order_id}:
 *   get:
 *     summary: view one order by ID (admin and buyer)
 *     tags: [checkout]
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     parameters:
 *       - name: order_id
 *         in: path
 *         description: order id to get it
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 *   patch:
 *     summary: Update an order by ID (admin and buyer)
 *     tags: [checkout]
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deliveryCountry:
 *                 type: string
 *               deliveryCity:
 *                 type: string
 *               deliveryStreet:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /checkout/{order_id}:
 *   delete:
 *     summary: Delete an order by ID (admin and buyer)
 *     tags: [checkout]
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: order_id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the order to delete
 *     responses:
 *       204:
 *         description: No content
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
/**
 * @swagger
 * /checkout/orders:
 *   get:
 *     summary: Get all orders from all buyers and sellers (admin)
 *     tags: [checkout]
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     parameters:
 *        - name: limit
 *          in: query
 *          type: integer
 *          format: int32
 *          description: The maximum number of results to retrieve per page.
 *        - name: page
 *          in: query
 *          type: integer
 *          format: int32
 *          description: The page number to retrieve. Default value is 1
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *       500:
 *         description: Server error
 */
