// src/controllers/complaintController.js

import Complaint from '../models/Complaint.js';

const createComplaint = async (req, res) => {
    const { description } = req.body;
    const userId = req.user.id;

    const complaint = await Complaint.create({
        userId,
        description,
    });

    res.status(201).json(complaint);
};

const getComplaints = async (req, res) => {
    const complaints = await Complaint.findAll({
        where: { userId: req.user.id },
    });

    res.status(200).json(complaints);
};

const updateComplaintStatus = async (req, res) => {
    const { complaintId, status } = req.body;

    const complaint = await Complaint.findByPk(complaintId);

    if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.status = status;
    await complaint.save();

    res.status(200).json(complaint);
};

// Feedback on complaint resolution
const giveFeedback = async (req, res) => {
    const { complaintId, feedback } = req.body;

    const complaint = await Complaint.findByPk(complaintId);

    if (!complaint) {
        return res.status(404).json({ message: 'Complaint not found' });
    }

    complaint.feedback = feedback;
    await complaint.save();

    res.status(200).json(complaint);
};

export { createComplaint, getComplaints, updateComplaintStatus, giveFeedback };
