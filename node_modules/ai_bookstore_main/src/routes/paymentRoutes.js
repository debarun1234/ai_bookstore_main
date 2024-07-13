// src/routes/paymentRoutes.js

import express from 'express';
import { createPaymentIntent, verifyRazorpaySignature, verifyUPIPayment, updatePaymentStatus } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-payment-intent', protect, createPaymentIntent);
router.post('/verify-razorpay-signature', verifyRazorpaySignature);
router.post('/verify-upi-payment', verifyUPIPayment);
router.post('/update-payment-status', protect, updatePaymentStatus);

export default router;
