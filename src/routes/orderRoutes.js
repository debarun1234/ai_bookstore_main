// src/routes/orderRoutes.js

const express = require('express');
const { check } = require('express-validator');
const { addOrderItems, getOrderById, updateOrderToShipped, updateOrderToDelivered, getUserOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

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

module.exports = router;
