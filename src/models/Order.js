// src/models/Order.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Book from './Book.js';

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
        type: DataTypes.ENUM('processing', 'shipped', 'delivered', 'cancelled'),
        defaultValue: 'processing',
    },
    paymentStatus: {
        type: DataTypes.ENUM('pending', 'completed', 'failed'),
        defaultValue: 'pending',
    },
    orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    timestamps: true,
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
}, {
    timestamps: true,
});

Order.hasMany(OrderItem, { as: 'items' });
OrderItem.belongsTo(Order);
Book.hasMany(OrderItem, { as: 'orderItems' });
OrderItem.belongsTo(Book);

Order.sync({ alter: true });
OrderItem.sync({ alter: true });

export { Order, OrderItem };
