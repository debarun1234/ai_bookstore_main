// src/controllers/wishlistController.js

import Wishlist from '../models/wishlist.js';
import User from '../models/User.js';
import Book from '../models/Book.js';

const addToWishlist = async (req, res) => {
    const { bookId } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    await Wishlist.create({ userId: req.user.id, bookId });
    res.status(200).json({ message: 'Book added to wishlist' });
};

const removeFromWishlist = async (req, res) => {
    const { bookId } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    const book = await Book.findByPk(bookId);
    if (!book) {
        return res.status(404).json({ message: 'Book not found' });
    }

    await Wishlist.destroy({ where: { userId: req.user.id, bookId } });
    res.status(200).json({ message: 'Book removed from wishlist' });
};

const getWishlist = async (req, res) => {
    const user = await User.findByPk(req.user.id, {
        include: {
            model: Book,
            through: { attributes: [] }
        }
    });

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user.Books);
};

export { addToWishlist, removeFromWishlist, getWishlist };
