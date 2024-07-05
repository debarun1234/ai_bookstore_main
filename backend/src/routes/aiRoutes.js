// src/routes/aiRoutes.js

import express from 'express';
import { getRecommendations, assignGenre } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/recommendations')
    .post(protect, getRecommendations);

router.route('/assign-genre')
    .post(protect, assignGenre);

export default router;
