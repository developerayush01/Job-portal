const { sequelize } = require('../config/dbConfig');

const User = require('./userModel');
const Company = require('./companyModel');
const Category = require('./categoryModel');
const Resume = require('./resumeModel');
const Job = require('./jobModel');
const Application = require('./applicationModel');

// User -> Company (employer owns companies)
User.hasMany(Company, { foreignKey: 'userId', as: 'companies' });
Company.belongsTo(User, { foreignKey: 'userId', as: 'employer' });

// User -> Resume
User.hasMany(Resume, { foreignKey: 'userId', as: 'resumes' });
Resume.belongsTo(User, { foreignKey: 'userId', as: 'owner' });

// Company -> Job
Company.hasMany(Job, { foreignKey: 'companyId', as: 'jobs' });
Job.belongsTo(Company, { foreignKey: 'companyId', as: 'company' });

// Category -> Job
Category.hasMany(Job, { foreignKey: 'categoryId', as: 'jobs' });
Job.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });

// Job -> Application
Job.hasMany(Application, { foreignKey: 'jobId', as: 'applications' });
Application.belongsTo(Job, { foreignKey: 'jobId', as: 'job' });

// User -> Application (as applicant)
User.hasMany(Application, { foreignKey: 'applicantId', as: 'applications' });
Application.belongsTo(User, { foreignKey: 'applicantId', as: 'applicant' });

// Resume -> Application
Resume.hasMany(Application, { foreignKey: 'resumeId', as: 'applications' });
Application.belongsTo(Resume, { foreignKey: 'resumeId', as: 'resume' });

module.exports = {
  sequelize,
  User,
  Company,
  Category,
  Resume,
  Job,
  Application,
};