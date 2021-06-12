const Sequelize = require('sequelize');
//extraer valores de variables.env
require('dotenv').config({ path: 'variables.env'})

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USER, process.env.BD_PASS, {
  host: process.env.BD_HOST,//127.0.0.1
  dialect: 'mysql',
  port: process.env.BD_PORT,
  "operatorsAliases": "false",
  define: {
      timestamps: false
  },
  pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
  }
});//Asi se conecta una base de datos de Node utilizando sequelize

module.exports = db;