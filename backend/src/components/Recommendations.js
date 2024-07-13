// src/components/Recommendations.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = () => {
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const response = await axios.post('/api/ai/recommendations');
                setRecommendations(response.data);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            }
        };

        fetchRecommendations();
    }, []);

    return (
        <div>
            <h2>Recommended Books for You</h2>
            <ul>
                {recommendations.map((book) => (
                    <li key={book.id}>
                        <h3>{book.title}</h3>
                        <p>{book.author}</p>
                        <p>{book.genre}</p>
                        <p>{book.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Recommendations;
