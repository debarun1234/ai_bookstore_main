// src/index.js

import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB, sequelize } from './config/db.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import shipmentRoutes from './routes/shipmentRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import complaintRoutes from './routes/complaintRoutes.js';
import apiLimiter from './middleware/ratelimiter.js';

dotenv.config();

connectDB();

const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use(apiLimiter); // Apply rate limiting to all routes

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/shipments', shipmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/complaints', complaintRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to AI Bookstore');
});

app.use(errorHandler);

sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
