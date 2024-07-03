// src/routes/bookRoutes.js

const express = require('express');
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/').get(getBooks).post(protect, admin, createBook);
router.route('/:id').get(getBookById).put(protect, admin, updateBook).delete(protect, admin, deleteBook);

module.exports = router;
