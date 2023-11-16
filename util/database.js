const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.Schema_Name, process.env.Root_ID, process.env.Password_ID, {
  dialect: 'mysql',
  host: process.env.DB_HOST,
  logging:false
});

module.exports = sequelize;
