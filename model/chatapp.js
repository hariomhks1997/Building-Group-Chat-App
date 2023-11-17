const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const chatmessage = sequelize.define('message', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name:Sequelize.STRING,
message:Sequelize.STRING,
  
  
  
});

module.exports = chatmessage;
 