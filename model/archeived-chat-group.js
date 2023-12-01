const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ArchivedChatgroup = sequelize.define('ArchivedChatgroup',{
    id: {
      type: Sequelize.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name:Sequelize.STRING,
    message: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    isImage:{
      type : Sequelize.BOOLEAN , 
    defaultValue : false
  },
    date:Sequelize.STRING,
    userId:{
      type: Sequelize.BIGINT,
    },
    GroupId:{
      type: Sequelize.BIGINT,
    }
  },
  
);

module.exports = ArchivedChatgroup;