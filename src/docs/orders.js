/**
 * @swagger
 * tags:
 *   name: checkout
 */
/**
 * @swagger
 * /checkout:
 *   get:
 *     summary: Get all orders
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
 *     summary: view one order by ID
 *     tags: [checkout]
 *     security:
 *        - {}
 *        - bearerAuth: []
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
 *               paymentMethod:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 *   patch:
 *     summary: Update an order by ID
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
 *               paymentMethod:
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
 *     summary: Delete an order by ID
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
 *     summary: Get all orders from all buyers and sellers
 *     tags: [checkout]
 *     security:
 *        - {}
 *        - bearerAuth: []
 *     responses:
 *       200:
 *         description: All orders retrieved successfully
 *       500:
 *         description: Server error
 */
