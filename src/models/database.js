const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

const DBconnection = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  database: dbConfig.DB,
  debug: true,
  timezone:"Asia/Bangkok"
});

// open the MySQL DBconnection
DBconnection.connect((error) => {
  if (error) throw error;
  console.log("Successfully connected to the database.");
});

module.exports = DBconnection;
