const express = require('express');
const router = express.Router();

const { createJob, editJob, deleteJob, getJobById,getJobByCategory,getMyJobs,getJobsByCompany,getActiveJobs,getInactiveJobs } = require('../controllers/jobController');
const { auth } = require('../middleware/authMiddleware');

router.post('/create', auth, createJob);
router.put('/edit/:jobId', auth, editJob);
router.delete('/delete/:jobId', auth, deleteJob);

router.get('/category/:categoryId', getJobByCategory);
router.get('/my-jobs', auth, getMyJobs);
router.get('/company/:companyId', getJobsByCompany);
router.get('/active', getActiveJobs);
router.get('/inactive', auth, getInactiveJobs);

router.get('/:jobId', getJobById);

module.exports = router;