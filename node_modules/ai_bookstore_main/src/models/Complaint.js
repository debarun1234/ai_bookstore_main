// src/models/Complaint.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';

const Complaint = sequelize.define('Complaint', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.ENUM('open', 'resolved'),
        defaultValue: 'open',
    },
    feedback: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    timestamps: true
});

Complaint.sync({ alter: true });

export default Complaint;
