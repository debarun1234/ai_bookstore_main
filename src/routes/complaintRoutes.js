// src/routes/complaintRoutes.js

import express from 'express';
import { createComplaint, getComplaints, updateComplaintStatus, giveFeedback } from '../controllers/complaintController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
    .post(protect, createComplaint)
    .get(protect, getComplaints);

router.route('/update-status')
    .post(protect, [
        check('complaintId', 'Complaint ID is required').not().isEmpty(),
        check('status', 'Status is required').isIn(['open', 'resolved'])
    ], updateComplaintStatus);

router.route('/feedback')
    .post(protect, giveFeedback);

export default router;
