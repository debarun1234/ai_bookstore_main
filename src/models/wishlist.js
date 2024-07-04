// src/models/Wishlist.js

import { DataTypes } from 'sequelize';
import { sequelize } from '../config/db.js';
import User from './User.js';
import Book from './Book.js';

const Wishlist = sequelize.define('Wishlist', {
    userId: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        }
    },
    bookId: {
        type: DataTypes.INTEGER,
        references: {
            model: Book,
            key: 'id'
        }
    }
}, {
    timestamps: false
});

User.belongsToMany(Book, { through: Wishlist, foreignKey: 'userId' });
Book.belongsToMany(User, { through: Wishlist, foreignKey: 'bookId' });

Wishlist.sync({ alter: true });

export default Wishlist;
