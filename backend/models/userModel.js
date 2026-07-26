const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/dbConfig');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    defaultValue: DataTypes.UUIDV4,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('JobSeeker', 'JobProvider', 'Admin'),
    allowNull: false,
    defaultValue: 'JobSeeker',
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otpExpiresAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

module.exports = User;