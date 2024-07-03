// src/models/Order.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const User = require('./User');
const Book = require('./Book');

const Order = sequelize.define('Order', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id',
        },
    },
    totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('processing', 'shipped', 'delivered'),
        defaultValue: 'processing',
    },
});

const OrderItem = sequelize.define('OrderItem', {
    orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Order,
            key: 'id',
        },
    },
    bookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Book,
            key: 'id',
        },
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
});

Order.hasMany(OrderItem, { as: 'items' });
OrderItem.belongsTo(Order);
Book.hasMany(OrderItem, { as: 'orderItems' });
OrderItem.belongsTo(Book);

Order.sync({ alter: true });
OrderItem.sync({ alter: true });

module.exports = { Order, OrderItem };
