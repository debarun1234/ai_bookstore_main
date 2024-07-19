// src/config/db.js

import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(process.env.PG_URI, {
    dialect: 'postgres',
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL database.');
        await sequelize.sync({ alter: true }); // Add this line
    } catch (error) {
        console.error('Unable to connect to PostgreSQL database:', error);
        process.exit(1);
    }
};

export { sequelize, connectDB };
