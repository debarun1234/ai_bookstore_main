// src/routes/orderRoutes.js

import express from 'express';
import { check } from 'express-validator';
import { addOrderItems, getOrderById, updateOrderStatus, getUserOrders, cancelOrder, getUserOrderHistory } from '../controllers/orderController.js';
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

router.route('/history')
    .get(protect, getUserOrderHistory);

router.route('/:id')
    .get(protect, getOrderById);

router.route('/update-status')
    .post(protect, admin, [
        check('orderId', 'Order ID is required').not().isEmpty(),
        check('status', 'Status is required').isIn(['processing', 'shipped', 'delivered', 'cancelled'])
    ], updateOrderStatus);

router.route('/cancel')
    .post(protect, [
        check('orderId', 'Order ID is required').not().isEmpty(),
        check('phone', 'Phone number is required').not().isEmpty(),
    ], cancelOrder);

export default router;
