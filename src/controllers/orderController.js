// src/controllers/orderController.js

const Order = require('../models/Order');

const addOrderItems = async (req, res) => {
    const { orderItems, address, totalAmount } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = new Order({
            user: req.user._id,
            books: orderItems,
            address,
            totalAmount,
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    }
};

const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'firstName lastName email');

    if (order) {
        res.json(order);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const updateOrderToShipped = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = 'shipped';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.status = 'delivered';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const getUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToShipped,
    updateOrderToDelivered,
    getUserOrders,
};
