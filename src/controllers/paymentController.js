// src/controllers/paymentController.js

import Stripe from 'stripe';
import dotenv from 'dotenv';
import axios from 'axios';
import Payment from '../models/Payment.js';
import Order from '../models/Order.js'; // Ensure Order model is imported

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

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

        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(convertedAmount * 100), // Amount in cents
            currency: 'inr',
            payment_method_types: [paymentMethod === 'credit/debit card' ? 'card' : ''],
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
    } catch (error) {
        res.status(500).json({ message: error.message });
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

export { createPaymentIntent, updatePaymentStatus };
