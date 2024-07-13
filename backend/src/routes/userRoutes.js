// src/routes/userRoutes.js

import express from 'express';
import { check } from 'express-validator';
import { registerUser, loginUser, getUserProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post([
        check('firstName', 'First name is required').not().isEmpty(),
        check('lastName', 'Last name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be 6 or more characters').isLength({ min: 6 })
    ], registerUser);

router.route('/login')
    .post([
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists()
    ], loginUser);

router.route('/profile')
    .get(protect, getUserProfile);

export default router;
