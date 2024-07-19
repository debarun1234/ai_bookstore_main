CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(255) NOT NULL,
    lastName VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL,
    wishlist INTEGER[] DEFAULT ARRAY[]::INTEGER[]
);

CREATE TABLE Books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    genre VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price NUMERIC NOT NULL,
    isbn VARCHAR(255) NOT NULL
);

CREATE TABLE Orders (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL REFERENCES Users(id),
    totalAmount NUMERIC NOT NULL,
    address TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'processing',
    paymentStatus VARCHAR(50) DEFAULT 'pending',
    orderId VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE OrderItems (
    id SERIAL PRIMARY KEY,
    orderId INTEGER NOT NULL REFERENCES Orders(id),
    bookId INTEGER NOT NULL REFERENCES Books(id),
    quantity INTEGER NOT NULL
);

CREATE TABLE Payments (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL REFERENCES Users(id),
    orderId INTEGER NOT NULL REFERENCES Orders(id),
    amount NUMERIC NOT NULL,
    currency VARCHAR(50) NOT NULL DEFAULT 'inr',
    status VARCHAR(50) NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    paymentIntentId VARCHAR(255) UNIQUE,
    transactionId VARCHAR(255) UNIQUE
);

CREATE TABLE Shipments (
    id SERIAL PRIMARY KEY,
    orderId INTEGER NOT NULL REFERENCES Orders(id),
    trackingNumber VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(50) DEFAULT 'in transit'
);

CREATE TABLE Complaints (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL REFERENCES Users(id),
    description TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'open',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Recommendations (
    id SERIAL PRIMARY KEY,
    userId INTEGER NOT NULL REFERENCES Users(id),
    bookId INTEGER NOT NULL REFERENCES Books(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
