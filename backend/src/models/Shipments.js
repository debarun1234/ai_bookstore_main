// src/models/Shipment.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import Order from './Order.js';

const Shipment = sequelize.define('Shipment', {
    orderId: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id'
        }
    },
    trackingNumber: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('pending', 'shipped', 'delivered'),
        defaultValue: 'pending',
    }
}, {
    timestamps: true
});

Shipment.sync({ alter: true });

export default Shipment;
