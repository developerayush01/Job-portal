const { Job, Company, Category } = require('../models');
const asyncHandler = require('../utils/asyncHandler');

const createJob = asyncHandler(async (req, res) => {
  
  if (req.user.role !== 'JobProvider') {
    return res.status(403).json({ message: 'Only job providers can post jobs' });
  }

  const {
    companyId,
    categoryId,
    title,
    description,
    location,
    salary,
    isNegotiable,
    experienceLevel,
    jobType,
  } = req.body;

  
  if (!companyId || !categoryId || !title || !description || !location) {
    return res.status(400).json({ message: 'Missing required fields' });
  }
  
  const company = await Company.findOne({
    where: { id: companyId, userId: req.user.id },
  });

  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  if (!company.isActive) {
    return res.status(403).json({ message: 'This company is not active' });
  }
  
  const category = await Category.findByPk(categoryId);
  if (!category) {
    return res.status(400).json({ message: 'Invalid category' });
  }
  
  const job = await Job.create({
    companyId: company.id,
    categoryId: category.id,
    title,
    description,
    location,
    salary,
    isNegotiable,
    experienceLevel,
    jobType,
  });

  return res.status(201).json({ message: 'Job created successfully', job });
});

const editJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (req.user.role !== 'JobProvider') {
    return res.status(403).json({ message: 'Only job providers can edit jobs' });
  }

  const job = await Job.findOne({
    where: { id: jobId },
    include: [{ model: Company, as: 'company' }],
  });

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.company.userId !== req.user.id) {
    return res.status(403).json({ message: 'Not Authorized to edit' });
  }

  if (!job.company.isActive) {
    return res.status(403).json({ message: 'This company is not active' });
  }

  const {
    title,
    description,
    location,
    salary,
    isNegotiable,
    experienceLevel,
    jobType,
    status,
  } = req.body;

  job.title = title ?? job.title;
  job.description = description ?? job.description;
  job.location = location ?? job.location;
  job.salary = salary ?? job.salary;
  job.isNegotiable = isNegotiable ?? job.isNegotiable;
  job.experienceLevel = experienceLevel ?? job.experienceLevel;
  job.jobType = jobType ?? job.jobType;
  job.status = status ?? job.status;

  await job.save();

  return res.status(200).json({ message: 'Job updated successfully', job });
});

const deleteJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  if (req.user.role !== 'JobProvider') {
    return res.status(403).json({ message: 'Only job providers can delete jobs' });
  }

  const job = await Job.findOne({
    where: { id: jobId },
    include: [{ model: Company, as: 'company' }],
  });

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.company.userId !== req.user.id) {
    return res.status(403).json({ message: 'You do not have permission to delete this job' });
  }

  if (!job.isActive) {
    return res.status(400).json({ message: 'Job is already deleted' });
  }

  job.isActive = false;
  await job.save();

  return res.status(200).json({ message: 'Job deleted successfully' });
});

const getJobById = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findAll({
    where: { id: jobId },
    include: [{ model: Company, as: 'company' }, { model: Category, as: 'category' }],
  });

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (req.user && req.user.role === 'JobProvider' && job.company.userId !== req.user.id) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.isActive && job.company.isActive) {
    return res.status(200).json({ job });
  }

  if (req.user && job.company.userId === req.user.id) {
    return res.status(200).json({ job });
  }

  return res.status(404).json({ message: 'Job not found' });
});

const getJobByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;
  
  const job = await Job.findAll({
    where: { categoryId: categoryId },
    include: [{ model: Company, as: 'company' }, { model: Category, as: 'category' }],
  });

  if (!job) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (req.user && req.user.role === 'JobProvider' && job.company.userId !== req.user.id) {
    return res.status(404).json({ message: 'Job not found' });
  }

  if (job.isActive && job.company.isActive) {
    return res.status(200).json({ job });
  }

  if (req.user && job.company.userId === req.user.id) {
    return res.status(200).json({ job });
  }

  return res.status(404).json({ message: 'Job not found' });
});

module.exports = { createJob, editJob, deleteJob, getJobById,getJobByCategory };