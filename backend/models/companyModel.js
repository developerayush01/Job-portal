const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/dbConfig");

const Company = sequelize.define("Company", {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  logoUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  website: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = Company;
