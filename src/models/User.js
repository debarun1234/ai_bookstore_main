// src/models/User.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import bcrypt from 'bcryptjs';

const User = sequelize.define('User', {
    firstName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {
                args: [6, 100],
                msg: "Password must be at least 6 characters long",
            },
        },
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            isNumeric: true,
            len: {
                args: [10, 15],
                msg: "Phone number must be between 10 and 15 digits",
            },
        },
    },
    role: {
        type: DataTypes.ENUM('user', 'seller', 'admin'),
        allowNull: false,
        defaultValue: 'user',
    },
    wishlist: {
        type: DataTypes.ARRAY(DataTypes.INTEGER), // Array of book IDs
        defaultValue: [],
    },
}, {
    indexes: [
        {
            unique: true,
            fields: ['email'],
        },
        {
            fields: ['role'],
        },
    ],
    hooks: {
        beforeSave: async (user) => {
            if (user.changed('password')) {
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(user.password, salt);
            }
        },
    },
});

User.prototype.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

User.sync({ alter: true });

export default User;
