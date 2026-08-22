const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  coverLetter: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'Reviewed', 'Accepted', 'Rejected'),
    allowNull: false,
    defaultValue: 'Pending',
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  },
});

module.exports = Application;