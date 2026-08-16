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

module.exports = { createJob };