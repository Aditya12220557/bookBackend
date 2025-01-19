const express = require('express');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Create a new user
router.post('/createUser', userController.createUser);

// Login a user
router.post('/loginUser', userController.loginUser);

// Logout a user
router.post('/logoutUser', userController.logoutUser);

// Protected route example
router.get('/profile', authMiddleware, (req, res) => {
    res.send({ user: req.user });
});

module.exports = router;