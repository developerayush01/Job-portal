const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/authMiddleware');
const {
  createApplication,
  editApplication,
  deleteApplication,
  getApplicationById,
  getMyApplications,
  getApplicationByJob,
  getAllApplications,
} = require('../controllers/applicationController');

router.post('/create', auth, createApplication);
router.put('/edit/:id', auth, editApplication);
router.delete('/delete/:id', auth, deleteApplication);

router.get('/my-applications', auth, getMyApplications);
router.get('/job', auth, getApplicationByJob);
router.get('/all', auth, getAllApplications);
router.get('/:id', auth, getApplicationById);

module.exports = router;