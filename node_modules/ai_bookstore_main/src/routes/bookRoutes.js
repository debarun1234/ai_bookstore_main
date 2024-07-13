// src/routes/bookRoutes.js

import express from 'express';
import { check } from 'express-validator';
import { getBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import cache from '../middleware/cacheMiddleware.js';
import rateLimit from 'express-rate-limit';

const router = express.Router();

const createBookLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 create book requests per windowMs
    message: 'Too many books created from this IP, please try again later.'
});

const updateBookLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 update book requests per windowMs
    message: 'Too many books updated from this IP, please try again later.'
});

router.route('/')
    .get(cache('books'), getBooks)
    .post(protect, admin, createBookLimiter, [
        check('title', 'Title is required').not().isEmpty(),
        check('author', 'Author is required').not().isEmpty(),
        check('genre', 'Genre is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('price', 'Price is required').isFloat({ gt: 0 }),
        check('isbn', 'ISBN is required').not().isEmpty()
    ], createBook);

router.route('/:id')
    .get(cache('book'), getBookById)
    .put(protect, admin, updateBookLimiter, [
        check('title', 'Title is required').not().isEmpty(),
        check('author', 'Author is required').not().isEmpty(),
        check('genre', 'Genre is required').not().isEmpty(),
        check('description', 'Description is required').not().isEmpty(),
        check('price', 'Price is required').isFloat({ gt: 0 }),
        check('isbn', 'ISBN is required').not().isEmpty()
    ], updateBook)
    .delete(protect, admin, deleteBook);

export default router;

