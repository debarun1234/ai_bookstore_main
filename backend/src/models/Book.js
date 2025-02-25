// src/models/Book.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';

const Book = sequelize.define('Book', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    genre: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    isbn: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    indexes: [
        {
            fields: ['title'],
        },
        {
            fields: ['author'],
        },
        {
            fields: ['genre'],
        },
        {
            fields: ['isbn'],
        },
    ],
});

Book.sync({ alter: true });

export default Book;
