// src/routes/shipmentRoutes.js

import express from 'express';
import { check } from 'express-validator';
import { createShipment, getShipmentByOrderId, updateShipmentStatus, trackShipment } from '../controllers/shipmentController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, admin, createShipment);

router.route('/:id')
    .get(protect, getShipmentByOrderId);

router.route('/update-status')
    .post(protect, admin, [
        check('orderId', 'Order ID is required').not().isEmpty(),
        check('status', 'Status is required').isIn(['in transit', 'delivered', 'returned'])
    ], updateShipmentStatus);

router.route('/track/:trackingNumber')
    .get(protect, trackShipment);

export default router;
