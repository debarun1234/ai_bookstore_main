// src/controllers/orderController.js

import Order, { OrderItem } from '../models/Order.js';
import Shipment from '../models/Shipment.js';
import Book from '../models/Book.js';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer'; // For email notifications
import twilio from 'twilio'; // For SMS notifications
import Payment from '../models/Payment.js';
import Stripe from 'stripe';
import Razorpay from 'razorpay';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Twilio setup
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new twilio(accountSid, authToken);

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendNotification = async (order, message) => {
    const user = await order.getUser();
    // Send SMS
    client.messages.create({
        body: message,
        to: user.phone,
        from: process.env.TWILIO_PHONE_NUMBER
    });

    // Send Email
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: 'Order Notification',
        text: message
    };
    transporter.sendMail(mailOptions);
};

const addOrderItems = async (req, res) => {
    const { orderItems, address, totalAmount } = req.body;
    const userId = req.user.id;

    if (!orderItems || orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    }

    const orderId = uuidv4();
    const order = await Order.create({
        userId,
        totalAmount,
        address,
        orderId,
    });

    const orderItemsPromises = orderItems.map(async (item) => {
        const book = await Book.findByPk(item.bookId);
        if (book) {
            await OrderItem.create({
                orderId: order.id,
                bookId: item.bookId,
                quantity: item.quantity,
            });
        }
    });

    await Promise.all(orderItemsPromises);

    await sendNotification(order, `Your order with ID ${orderId} has been placed successfully.`);

    res.status(201).json(order);
};

const getOrderById = async (req, res) => {
    const order = await Order.findByPk(req.params.id, {
        include: [{ model: OrderItem, as: 'items' }],
    });

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;

    const order = await Order.findOne({ where: { orderId } });

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    await order.save();

    if (status === 'shipped') {
        await Shipment.create({
            orderId: order.id,
            trackingNumber: uuidv4(), // Generate a tracking number
        });
    }

    await sendNotification(order, `Your order with ID ${orderId} has been ${status}.`);

    res.status(200).json(order);
};

const getUserOrders = async (req, res) => {
    const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [{ model: OrderItem, as: 'items' }],
    });
    res.json(orders);
};

const cancelOrder = async (req, res) => {
    const { orderId, phone } = req.body;

    const order = await Order.findOne({ where: { orderId, phone } });

    if (!order) {
        return res.status(404).json({ message: 'Order not found or phone number mismatch' });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
        return res.status(400).json({ message: 'Cannot cancel shipped or delivered orders' });
    }

    order.status = 'cancelled';
    await order.save();

    // Process refund based on payment method
    const payment = await Payment.findOne({ where: { orderId: order.id } });

    if (!payment) {
        return res.status(404).json({ message: 'Payment not found for this order' });
    }

    if (payment.paymentMethod === 'credit/debit card') {
        // Refund using Stripe
        const refund = await stripe.refunds.create({
            payment_intent: payment.paymentIntentId,
        });

        payment.status = 'refunded';
        payment.transactionId = refund.id;
    } else if (payment.paymentMethod === 'Razorpay') {
        // Refund using Razorpay
        const refund = await razorpay.payments.refund(payment.transactionId);

        payment.status = 'refunded';
        payment.transactionId = refund.id;
    } else if (payment.paymentMethod === 'UPI') {
        // Refund using Razorpay for UPI
        const refund = await razorpay.payments.refund(payment.transactionId);

        payment.status = 'refunded';
        payment.transactionId = refund.id;
    }

    await payment.save();

    await sendNotification(order, `Your order with ID ${orderId} has been cancelled.`);

    res.status(200).json({ message: 'Order cancelled and refund processed successfully' });
};

const getUserOrderHistory = async (req, res) => {
    const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [{ model: OrderItem, as: 'items' }],
        order: [['createdAt', 'DESC']]
    });
    res.json(orders);
};

export { addOrderItems, getOrderById, updateOrderStatus, getUserOrders, cancelOrder, getUserOrderHistory };
