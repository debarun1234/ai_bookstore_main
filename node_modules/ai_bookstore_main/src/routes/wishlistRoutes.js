// src/routes/wishlistRoutes.js

import express from 'express';
import { addToWishlist, removeFromWishlist, getWishlist } from '../controllers/wishlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .get(protect, getWishlist)
    .post(protect, addToWishlist)
    .delete(protect, removeFromWishlist);

export default router;
