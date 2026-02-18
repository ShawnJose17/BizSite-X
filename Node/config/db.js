const mysql = require("mysql2/promise");

const pool = mysql.createPool({
  host: "localhost",
  user: "SJ",
  password: "Shawn@2004",
  database: "bizsite",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
