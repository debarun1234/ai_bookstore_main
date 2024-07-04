// src/routes/paymentRoutes.js

import express from 'express';
import { createPaymentIntent, updatePaymentStatus } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/update-payment-status', protect, updatePaymentStatus);

export default router;
