// src/controllers/paymentController.js

import Razorpay from 'razorpay';
import Stripe from 'stripe';
import dotenv from 'dotenv';
import axios from 'axios';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getConversionRate = async (fromCurrency, toCurrency) => {
    const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
    return response.data.rates[toCurrency];
};

const createPaymentIntent = async (req, res) => {
    const { orderId, amount, currency = 'inr', paymentMethod } = req.body; // Default currency as INR
    const userId = req.user.id;

    try {
        const order = await Order.findByPk(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        let convertedAmount = amount;

        if (currency !== 'inr') {
            const conversionRate = await getConversionRate(currency, 'usd');
            convertedAmount = amount * conversionRate;
        }

        if (paymentMethod === 'credit/debit card') {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(convertedAmount * 100), // Amount in cents
                currency: 'inr',
                payment_method_types: ['card'],
            });

            const payment = await Payment.create({
                userId,
                orderId,
                amount,
                currency,
                paymentMethod,
                status: paymentIntent.status,
                paymentIntentId: paymentIntent.id,
            });

            res.status(200).json({
                clientSecret: paymentIntent.client_secret,
                paymentId: payment.id,
            });
        } else if (paymentMethod === 'UPI') {
            // Mock UPI Payment Integration
            const upiPaymentUrl = `https://mockupiapi.example.com/pay?amount=${convertedAmount}&currency=${currency}&orderId=${orderId}`;

            const response = await axios.post(upiPaymentUrl);

            const payment = await Payment.create({
                userId,
                orderId,
                amount,
                currency,
                paymentMethod,
                status: 'pending',
                paymentIntentId: response.data.paymentIntentId,
            });

            res.status(200).json({
                upiPaymentUrl: response.data.paymentUrl,
                paymentId: payment.id,
            });
        } else if (paymentMethod === 'Razorpay') {
            const options = {
                amount: Math.round(convertedAmount * 100), // Amount in paise
                currency: 'inr',
                receipt: `receipt_order_${orderId}`,
                payment_capture: 1,
            };

            const response = await razorpay.orders.create(options);

            const payment = await Payment.create({
                userId,
                orderId,
                amount,
                currency,
                paymentMethod,
                status: 'created',
                paymentIntentId: response.id,
            });

            res.status(200).json({
                orderId: response.id,
                amount: response.amount,
                currency: response.currency,
                paymentId: payment.id,
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const verifyRazorpaySignature = async (req, res) => {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const body = razorpay_order_id + '|' + razorpay_payment_id;

    const expectedSignature = crypto
        .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
        .update(body.toString())
        .digest('hex');

    if (expectedSignature === razorpay_signature) {
        const payment = await Payment.findOne({ where: { paymentIntentId: razorpay_order_id } });

        if (payment) {
            payment.status = 'completed';
            payment.transactionId = razorpay_payment_id;
            await payment.save();

            res.status(200).json({ message: 'Payment verified successfully' });
        } else {
            res.status(404).json({ message: 'Payment not found' });
        }
    } else {
        res.status(400).json({ message: 'Invalid signature' });
    }
};

const updatePaymentStatus = async (req, res) => {
    const { paymentIntentId, status } = req.body;

    try {
        const payment = await Payment.findOne({ where: { paymentIntentId } });

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        payment.status = status;
        await payment.save();

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { createPaymentIntent, verifyRazorpaySignature, updatePaymentStatus };
