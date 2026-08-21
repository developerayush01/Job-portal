const { Job, Company, Category } = require('../models');
const { Op } = require('sequelize');
const asyncHandler = require('../utils/asyncHandler');

const createCompany = asyncHandler(async (req, res) => {
  if (req.user.role !== 'JobProvider') {
    return res.status(403).json({ message: 'Only JobProviders can create a company' });
  }

  const { name, description, location, logoUrl, website } = req.body;

  if (!name || !description || !location) {
    return res.status(400).json({ message: 'name, description and location are required' });
  }

  const normalizedName = name.replace(/\s+/g, '').toLowerCase();

  const myCompanies = await Company.findAll({ where: { userId: req.user.id } });
  const isDuplicateName = myCompanies.some(
    (c) => c.name.replace(/\s+/g, '').toLowerCase() === normalizedName
  );

  if (isDuplicateName) {
    return res.status(409).json({ message: 'You already have a company with this name' });
  }

  if (website) {
    const normalizedWebsite = website.replace(/\s+/g, '').toLowerCase();

    const otherUsersCompanies = await Company.findAll({
      where: { userId: { [Op.ne]: req.user.id } },
    });

    const isWebsiteTaken = otherUsersCompanies.some(
      (c) => c.website && c.website.replace(/\s+/g, '').toLowerCase() === normalizedWebsite
    );

    if (isWebsiteTaken) {
      return res.status(409).json({ message: 'This website is already registered by another company' });
    }
  }

  const company = await Company.create({
    name,
    description,
    location,
    logoUrl,
    website,
    userId: req.user.id,
  });

  return res.status(201).json({ message: 'Company created successfully', company });
});

const editCompany = asyncHandler(async (req, res) => {
  if (req.user.role !== 'JobProvider') {
    return res.status(403).json({ message: 'Only JobProviders can edit a company' });
  }

  const { companyId } = req.params;
  const { name, description, location, website } = req.body;

  const company = await Company.findOne({ where: { id: companyId } });

  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  if (company.userId !== req.user.id) {
    return res.status(403).json({ message: 'You do not have permission to edit this company' });
  }

  if (name) {
    const normalizedName = name.replace(/\s+/g, '').toLowerCase();

    const myOtherCompanies = await Company.findAll({
      where: { userId: req.user.id, id: { [Op.ne]: companyId } },
    });

    const isDuplicateName = myOtherCompanies.some(
      (c) => c.name.replace(/\s+/g, '').toLowerCase() === normalizedName
    );

    if (isDuplicateName) {
      return res.status(409).json({ message: 'You already have a company with this name' });
    }
  }

  if (website) {
    const normalizedWebsite = website.replace(/\s+/g, '').toLowerCase();

    const otherUsersCompanies = await Company.findAll({
      where: { userId: { [Op.ne]: req.user.id } },
    });

    const isWebsiteTaken = otherUsersCompanies.some(
      (c) => c.website && c.website.replace(/\s+/g, '').toLowerCase() === normalizedWebsite
    );

    if (isWebsiteTaken) {
      return res.status(409).json({ message: 'This website is already registered by another company' });
    }
  }

  company.name = name ?? company.name;
  company.description = description ?? company.description;
  company.location = location ?? company.location;
  company.website = website ?? company.website;

  await company.save();

  return res.status(200).json({ message: 'Company updated successfully', company });
});

const getCompanyById = asyncHandler(async (req, res) => {
  const { companyId } = req.params;

  const company = await Company.findOne({
    where: { id: companyId, isActive: true },
  });

  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  return res.status(200).json({ company });
});

const getAllCompany = asyncHandler(async (req, res) => {
  if (req.user.role !== 'JobProvider') {
    return res.status(403).json({ message: 'Only JobProviders can view their companies' });
  }

  
  const companies = await Company.findAll({
    where: { userId: req.user.id, isActive: true },
  });

  return res.status(200).json({ companies });
});

const deleteCompany = asyncHandler(async (req, res) => {
  if (req.user.role !== 'JobProvider') {
    return res.status(403).json({ message: 'Only JobProviders can delete a company' });
  }

  const { companyId } = req.params;

  const company = await Company.findOne({ where: { id: companyId } });

  if (!company) {
    return res.status(404).json({ message: 'Company not found' });
  }

  if (company.userId !== req.user.id) {
    return res.status(403).json({ message: 'You do not have permission to delete this company' });
  }

  if (!company.isActive) {
    return res.status(400).json({ message: 'Company is already deleted' });
  }

  company.isActive = false;
  await company.save();

  await Job.update(
    { isActive: false, status: 'Closed' },
    { where: { companyId: company.id } }
  );

  return res.status(200).json({ message: 'Company and its jobs deactivated successfully' });
});

module.exports={createCompany,editCompany,getCompanyById,getAllCompany,deleteCompany};