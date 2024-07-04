// src/routes/orderRoutes.js

import express from 'express';
import { check } from 'express-validator';
import { addOrderItems, getOrderById, updateOrderToShipped, updateOrderToDelivered, getUserOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, [
        check('orderItems', 'Order items cannot be empty').isArray({ min: 1 }),
        check('address', 'Address is required').not().isEmpty(),
        check('totalAmount', 'Total amount is required').isFloat({ gt: 0 })
    ], addOrderItems);

router.route('/myorders')
    .get(protect, getUserOrders);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/:id/ship')
    .put(protect, admin, updateOrderToShipped);

router.route('/:id/deliver')
    .put(protect, admin, updateOrderToDelivered);

export default router;
