// src/models/Recommendation.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Book from './Book.js';

const Recommendation = sequelize.define('Recommendation', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    bookId: {
        type: DataTypes.INTEGER,
        references: {
            model: Book,
            key: 'id'
        }
    },
    score: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
}, {
    timestamps: true
});

Recommendation.sync({ alter: true });

export default Recommendation;
