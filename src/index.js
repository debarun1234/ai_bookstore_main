// src/index.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB, sequelize } = require('./config/db'); // Add this line to import the connectDB function
const { errorHandler } = require('./middleware/errorMiddleware');
const userRoutes = require('./routes/userRoutes');
const bookRoutes = require('./routes/bookRoutes');
const orderRoutes = require('./routes/orderRoutes');

dotenv.config();

connectDB(); // Add this line to connect to the PostgreSQL database

const app = express();
app.use(bodyParser.json());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to AI Bookstore Backend');
});

app.use(errorHandler); // Add this line

// Synchronize models
sequelize.sync().then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
