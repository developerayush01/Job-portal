const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  salary: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  isNegotiable: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  experienceLevel: {
    type: DataTypes.ENUM('Entry', 'Mid', 'Senior'),
    allowNull: false,
    defaultValue: 'Entry',
  },
  jobType: {
    type: DataTypes.ENUM('Full-time', 'Part-time', 'Remote', 'Internship'),
    allowNull: false,
    defaultValue: 'Full-time',
  },
  status: {
    type: DataTypes.ENUM('Open', 'Closed'),
    allowNull: false,
    defaultValue: 'Open',
  },
});

module.exports = Job;