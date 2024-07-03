// src/controllers/bookController.js

const Book = require('../models/Book');

const getBooks = async (req, res) => {
    const books = await Book.find({});
    res.json(books);
};

const getBookById = async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
};

const createBook = async (req, res) => {
    const { title, author, genre, description, price, isbn } = req.body;

    const book = new Book({
        title,
        author,
        genre,
        description,
        price,
        isbn,
    });

    const createdBook = await book.save();
    res.status(201).json(createdBook);
};

const updateBook = async (req, res) => {
    const { title, author, genre, description, price, isbn } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
        book.title = title;
        book.author = author;
        book.genre = genre;
        book.description = description;
        book.price = price;
        book.isbn = isbn;

        const updatedBook = await book.save();
        res.json(updatedBook);
    } else {
        res.status(404).json({ message: 'Book not found' });
    }
};

const deleteBook = async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        await book.remove();
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
