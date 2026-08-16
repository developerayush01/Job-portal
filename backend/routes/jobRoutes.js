const express = require('express');
const router = express.Router();

const { createJob } = require('../controllers/jobController');
const { auth } = require('../middleware/authMiddleware');

router.post('/create', auth, createJob);

module.exports = router;