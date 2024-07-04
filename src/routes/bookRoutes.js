// src/routes/bookRoutes.js

const express = require('express');
const { check } = require('express-validator');
const { getBooks, getBookById, createBook, updateBook, deleteBook } = require('../controllers/bookController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
    .get(getBooks)
    .post(protect, admin, [
        check('title', 'Title is required').not().isEmpty(),
        check('author', 'Author is required').not().isEmpty(),
        check('genre', 'Genre is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('price', 'Price is required').isFloat({ gt: 0 }),
        check('isbn', 'ISBN is required').not().isEmpty()
    ], createBook);

router.route('/:id')
    .get(getBookById)
    .put(protect, admin, [
        check('title', 'Title is required').not().isEmpty(),
        check('author', 'Author is required').not().isEmpty(),
        check('genre', 'Genre is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('price', 'Price is required').isFloat({ gt: 0 }),
        check('isbn', 'ISBN is required').not().isEmpty()
    ], updateBook)
    .delete(protect, admin, deleteBook);

module.exports = router;
