// src/controllers/orderController.js

import { Order, OrderItem } from '../models/Order.js';
import Book from '../models/Book.js';
import { v4 as uuidv4 } from 'uuid';

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
    const { orderId } = req.body;
    const user = req.user;

    const order = await Order.findOne({ where: { orderId, userId: user.id } });

    if (!order) {
        return res.status(404).json({ message: 'Order not found' });
    }

    if (order.status === 'shipped' || order.status === 'delivered') {
        return res.status(400).json({ message: 'Cannot cancel shipped or delivered orders' });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({ message: 'Order cancelled successfully' });
};

export { addOrderItems, getOrderById, updateOrderStatus, getUserOrders, cancelOrder };
