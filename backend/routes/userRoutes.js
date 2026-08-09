const express = require('express');
const router = express.Router();
const {auth}=require("../middleware/authMiddleware")
const { registerUser, loginUser,verifyEmail,getProfile } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.get('/profile', auth, getProfile);

module.exports = router;