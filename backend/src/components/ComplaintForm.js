// src/components/ComplaintForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ComplaintForm = () => {
    const [description, setDescription] = useState('');
    const [feedback, setFeedback] = useState('');
    const [complaints, setComplaints] = useState([]);

    useEffect(() => {
        const fetchComplaints = async () => {
            try {
                const response = await axios.get('/api/complaints');
                setComplaints(response.data);
            } catch (error) {
                console.error('Error fetching complaints:', error);
            }
        };

        fetchComplaints();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/complaints', { description });
            setComplaints([...complaints, response.data]);
            setDescription('');
        } catch (error) {
            console.error('Error submitting complaint:', error);
        }
    };

    const handleFeedbackSubmit = async (e, complaintId) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/complaints/feedback', { complaintId, feedback });
            setComplaints(complaints.map(c => c.id === complaintId ? response.data : c));
            setFeedback('');
        } catch (error) {
            console.error('Error submitting feedback:', error);
        }
    };

    return (
        <div>
            <h2>Submit a Complaint</h2>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your issue"
                    required
                ></textarea>
                <button type="submit">Submit Complaint</button>
            </form>

            <h2>Complaints</h2>
            <ul>
                {complaints.map((complaint) => (
                    <li key={complaint.id}>
                        <p>{complaint.description}</p>
                        <p>Status: {complaint.status}</p>
                        {complaint.status === 'resolved' && !complaint.feedback && (
                            <form onSubmit={(e) => handleFeedbackSubmit(e, complaint.id)}>
                                <textarea
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Provide feedback"
                                    required
                                ></textarea>
                                <button type="submit">Submit Feedback</button>
                            </form>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ComplaintForm;
