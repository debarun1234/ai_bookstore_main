// src/controllers/bookController.js

const Book = require('../models/Book');

const getBooks = async (req, res) => {
    const books = await Book.findAll();
    res.json(books);
};

const getBookById = async (req, res) => {
    const book = await Book.findByPk(req.params.id);

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
};

const createBook = async (req, res) => {
    const { title, author, genre, description, price, isbn } = req.body;

    const book = await Book.create({
        title,
        author,
        genre,
        description,
        price,
        isbn,
    });

    res.status(201).json(book);
};

const updateBook = async (req, res) => {
    const { title, author, genre, description, price, isbn } = req.body;

    const book = await Book.findByPk(req.params.id);

    if (book) {
        book.title = title;
        book.author = author;
        book.genre = genre;
        book.description = description;
        book.price = price;
        book.isbn = isbn;

        await book.save();
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
};

const deleteBook = async (req, res) => {
    const book = await Book.findByPk(req.params.id);

    if (book) {
        await book.destroy();
        res.json({ message: 'Book removed' });
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
};

module.exports = {
    getBooks,
    getBookById,
    createBook,
    updateBook,
    deleteBook,
};
