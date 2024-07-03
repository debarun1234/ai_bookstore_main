// src/controllers/orderController.js

const { Order, OrderItem } = require('../models/Order');
const Book = require('../models/Book');

const addOrderItems = async (req, res) => {
    const { orderItems, address, totalAmount } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400).json({ message: 'No order items' });
        return;
    } else {
        const order = await Order.create({
            userId: req.user.id,
            address,
            totalAmount,
        });

        const orderItemsPromises = orderItems.map(async item => {
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
    }
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

const updateOrderToShipped = async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (order) {
        order.status = 'shipped';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const updateOrderToDelivered = async (req, res) => {
    const order = await Order.findByPk(req.params.id);

    if (order) {
        order.status = 'delivered';
        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const getUserOrders = async (req, res) => {
    const orders = await Order.findAll({
        where: { userId: req.user.id },
        include: [{ model: OrderItem, as: 'items' }],
    });
    res.json(orders);
};

module.exports = {
    addOrderItems,
    getOrderById,
    updateOrderToShipped,
    updateOrderToDelivered,
    getUserOrders,
};
