// src/models/Book.js

const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    isbn: { type: String, required: true },
});

const Book = mongoose.model('Book', BookSchema);

module.exports = Book;
