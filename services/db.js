
// Import the 'mysql' module
const mysql = require('mysql');

// Create a connection to the MySQL database
const con = mysql.createConnection({
  host: 'localhost', // MySQL server host
  user: 'root', // MySQL username
  password: '', // MySQL password
  database: 'express_db' // MySQL database name
});

// Connect to the MySQL database
con.connect((err) => {
  if (err) throw err;

  console.log("Database connected successfully");
});

// Export the MySQL connection object
module.exports = con;
