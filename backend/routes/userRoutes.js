const express = require('express');
const router = express.Router();
const { registerUser, loginUser,verifyEmail } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.get('/profile', protect, getProfile);

module.exports = router;