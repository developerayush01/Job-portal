const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const Resume = sequelize.define('Resume', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isPrimary: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

module.exports = Resume;