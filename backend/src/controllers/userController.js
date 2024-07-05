// src/controllers/userController.js

import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const registerUser = async (req, res) => {
    const { firstName, lastName, email, password, phone, role } = req.body;

    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
        res.status(400).json({ message: 'User already exists' });
        return;
    }

    const user = await User.create({
        firstName,
        lastName,
        email,
        password,
        phone,
        role,
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
            token: generateToken(user.id, user.role),
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

const getUserProfile = async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (user) {
        res.json({
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            phone: user.phone,
            role: user.role,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export { registerUser, loginUser, getUserProfile };
