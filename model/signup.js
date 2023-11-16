const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Signup = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name:Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    allowNull:false,
    unique:true

  },
  mobile:{
    type:Sequelize.STRING,
  },
  password:{
    type: Sequelize.TEXT,
        allowNull:false 
  },
  
  
  
});

module.exports = Signup;
 