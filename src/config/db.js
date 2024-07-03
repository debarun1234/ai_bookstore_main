// src/config/db.js

const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

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

module.exports = { sequelize, connectDB };
