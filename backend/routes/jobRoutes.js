const express = require('express');
const router = express.Router();

const { createJob,editJob, deleteJob } = require('../controllers/jobController');
const { auth } = require('../middleware/authMiddleware');

router.post('/create', auth, createJob);
router.put('/edit/:jobId', auth, editJob);
router.delete('/delete/:jobId', auth, deleteJob);

module.exports = router;