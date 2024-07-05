// src/controllers/aiController.js

import axios from 'axios';
import Recommendation from '../models/Recommendation.js';
import Book from '../models/Book.js';

const AI_BASE_URL = 'http://localhost:8000'; // Replace with your FastAPI service URL

const getRecommendations = async (req, res) => {
    const userId = req.user.id;

    try {
        // Fetch recommendations from AI service
        const response = await axios.post(`${AI_BASE_URL}/recommendations`, { user_id: userId });

        // Store recommendations in the database
        const recommendations = response.data.recommendations;
        await Promise.all(recommendations.map(async (bookId) => {
            await Recommendation.create({ userId, bookId, score: 1.0 }); // Example score
        }));

        // Fetch book details for the recommended books
        const recommendedBooks = await Book.findAll({
            where: {
                id: recommendations
            }
        });

        res.status(200).json(recommendedBooks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const assignGenre = async (req, res) => {
    const { description } = req.body;

    try {
        // Fetch genre assignment from AI service
        const response = await axios.post(`${AI_BASE_URL}/assign-genre`, { description });

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export { getRecommendations, assignGenre };
