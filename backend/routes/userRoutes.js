const express = require('express');
const router = express.Router();
const {auth}=require("../middleware/authMiddleware")
const { registerUser, loginUser,verifyEmail,getProfile,getProfileById,editProfile,deleteProfile } = require('../controllers/userController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.get('/profile', auth, getProfile);
router.get('/profile/:id', auth, getProfileById);
router.put('/profile/edit', auth, editProfile);
router.delete('/delete-profile', auth, deleteProfile);

module.exports = router;