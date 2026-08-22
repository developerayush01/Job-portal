const { Application, Job,Company,User } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const createApplication = asyncHandler(async (req, res) => {
  const { jobId, coverLetter } = req.body;

  if (!jobId) {
    return res.status(400).json({ message: 'jobId is required' });
  }

  const job = await Job.findOne({ where: { id: jobId, isActive: true, status: 'Open' } });

  if (!job) {
    return res.status(404).json({ message: 'Job not found or is no longer accepting applications' });
  }

  const existingApplication = await Application.findOne({
    where: { applicantId: req.user.id, jobId, isActive: true },
  });

  if (existingApplication) {
    return res.status(409).json({ message: 'You have already applied to this job' });
  }

  const application = await Application.create({
    applicantId: req.user.id,
    jobId,
    coverLetter,
  });

  return res.status(201).json({ message: 'Application submitted successfully', application });
});

const editApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const application = await Application.findOne({
    where: { id, isActive: true },
    include: {
      model: Job,
      as: 'job',
      include: { model: Company, as: 'company' },
    },
  });

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (req.user.role === 'JobProvider') {
    if (application.job.company.userId !== req.user.id) {
      return res.status(403).json({ message: 'You do not own the job this application belongs to' });
    }

    if (application.status === 'Accepted' || application.status === 'Rejected') {
      return res.status(400).json({ message: 'This application has already been finalized and cannot be changed' });
    }

    const { status } = req.body;
    const allowedStatuses = ['Reviewed', 'Accepted', 'Rejected'];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: 'status must be one of Reviewed, Accepted or Rejected' });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({ message: 'Application status updated successfully', application });
  }

  if (req.user.role === 'JobSeeker') {
    if (application.applicantId !== req.user.id) {
      return res.status(403).json({ message: 'You do not own this application' });
    }

    if (application.status !== 'Pending') {
      return res.status(400).json({ message: 'This application can no longer be edited' });
    }

    const { coverLetter } = req.body;
    application.coverLetter = coverLetter ?? application.coverLetter;
    await application.save();

    return res.status(200).json({ message: 'Application updated successfully', application });
  }

  return res.status(403).json({ message: 'You are not authorized to edit applications' });
});

const getApplicationById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const application = await Application.findOne({
    where: { id, isActive: true },
    include: [
      {
        model: Job,
        as: 'job',
        include: { model: Company, as: 'company' },
      },
      {
        model: User,
        as: 'applicant',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  const isOwningSeeker = application.applicantId === req.user.id;
  const isOwningProvider = application.job.company.userId === req.user.id;

  if (!isOwningSeeker && !isOwningProvider) {
    return res.status(404).json({ message: 'Application not found' });
  }

  return res.status(200).json({ message: 'Application fetched successfully', application });
});

const getMyApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'JobSeeker') {
    return res.status(403).json({ message: 'Only JobSeekers can view their applications' });
  }

  const applications = await Application.findAll({
    where: { applicantId: req.user.id, isActive: true },
    include: {
      model: Job,
      as: 'job',
      include: { model: Company, as: 'company' },
    },
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({ message: 'Applications fetched successfully', applications });
});

const getAllApplications = asyncHandler(async (req, res) => {
  if (req.user.role !== 'JobProvider') {
    return res.status(403).json({ message: 'Only JobProviders can view their applications' });
  }

  const applications = await Application.findAll({
    where: { isActive: true },
    include: {
      model: Job,
      as: 'job',
      required: true,
      include: {
        model: Company,
        as: 'company',
        required: true,
        where: { userId: req.user.id },
      },
    },
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({ message: 'Applications fetched successfully', applications });
});

const getApplicationByJob = asyncHandler(async (req, res) => {
  if (req.user.role !== 'JobProvider') {
    return res.status(403).json({ message: 'Only JobProviders can view applications for a job' });
  }

  const { jobId, status } = req.query;

  if (!jobId) {
    return res.status(400).json({ message: 'jobId is required' });
  }

  const allowedStatuses = ['Pending', 'Reviewed', 'Accepted', 'Rejected'];

  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'status must be one of Pending, Reviewed, Accepted or Rejected' });
  }

  const job = await Job.findOne({
    where: { id: jobId, isActive: true },
    include: { model: Company, as: 'company' },
  });

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.company.userId !== req.user.id) {
    return res.status(404).json({ message: 'Job not found' });
  }

  const applications = await Application.findAll({
    where: { jobId, isActive: true, ...(status && { status }) },
    include: {
      model: User,
      as: 'applicant',
      attributes: ['id', 'name', 'email'],
    },
    order: [['createdAt', 'DESC']],
  });

  return res.status(200).json({ message: 'Applications fetched successfully', applications });
});

const deleteApplication = asyncHandler(async (req, res) => {
  if (req.user.role !== 'JobSeeker') {
    return res.status(403).json({ message: 'Only JobSeekers can delete their applications' });
  }

  const { id } = req.params;

  const application = await Application.findOne({ where: { id, isActive: true } });

  if (!application) {
    return res.status(404).json({ message: 'Application not found' });
  }

  if (application.applicantId !== req.user.id) {
    return res.status(404).json({ message: 'Application not found' });
  }

  application.isActive = false;
  await application.save();

  return res.status(200).json({ message: 'Application deleted successfully' });
});

module.exports = { createApplication,editApplication,getApplicationById,getMyApplications,getAllApplications,getApplicationByJob,deleteApplication };