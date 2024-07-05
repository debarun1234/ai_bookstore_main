// src/models/Payment.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Order from './Order.js';

const Payment = sequelize.define('Payment', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'inr', // Default currency as INR
    },
    status: {
        type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
        allowNull: false,
    },
    paymentMethod: {
        type: DataTypes.ENUM('UPI', 'credit/debit card', 'COD', 'Razorpay'),
        allowNull: false,
    },
    paymentIntentId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
    transactionId: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
    },
}, {
    timestamps: true
});

Payment.sync({ alter: true });

export default Payment;
