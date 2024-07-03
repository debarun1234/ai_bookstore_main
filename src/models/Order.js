// src/models/Order.js

const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    books: [
        {
            book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
            quantity: { type: Number, required: true },
        }
    ],
    totalAmount: { type: Number, required: true },
    address: { type: String, required: true },
    status: { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
});

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
