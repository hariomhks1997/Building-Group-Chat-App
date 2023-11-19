const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const commonmessage = sequelize.define('commonmessage', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name:Sequelize.STRING,
message:Sequelize.STRING,
GroupId:Sequelize.INTEGER
  
  
  
});

module.exports = commonmessage;