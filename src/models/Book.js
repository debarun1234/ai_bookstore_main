// src/models/Book.js

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

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
});

Book.sync({ alter: true });

module.exports = Book;
