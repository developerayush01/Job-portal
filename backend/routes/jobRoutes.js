const express = require('express');
const router = express.Router();

const { createJob,editJob, deleteJob,getJobById,getJobByCategory } = require('../controllers/jobController');
const { auth } = require('../middleware/authMiddleware');

router.post('/create', auth, createJob);
router.put('/edit/:jobId', auth, editJob);
router.delete('/delete/:jobId', auth, deleteJob);
router.get('/:jobId', getJobById);
router.get('/:categoryId', getJobByCategory);

module.exports = router;