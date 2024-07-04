// src/routes/bookRoutes.js

import express from 'express';
import { check } from 'express-validator';
import { getBooks, getBookById, createBook, updateBook, deleteBook } from '../controllers/bookController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

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

export default router;
