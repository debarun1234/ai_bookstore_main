// src/config/db.js

import { Sequelize } from 'sequelize';
import { config } from 'dotenv';

config();

const sequelize = new Sequelize(process.env.PG_URI, {
    dialect: 'postgres',
    logging: false,
});

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to PostgreSQL database.');
    } catch (error) {
        console.error('Unable to connect to PostgreSQL database:', error);
        process.exit(1);
    }
};

export default { sequelize, connectDB };export const { sequelize } =;

