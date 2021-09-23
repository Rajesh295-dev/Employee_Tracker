
//Dependencies for sql
const mysql = require("mysql2");

//Connection to the database
const connection = mysql.createConnection({
  host: "localhost",
  // Mysql Username
  user: "root",
  // Mysql Password
  password: "password",
  database: "employeeTrackerDB"
 },

  console.log(`
  Connected to the database 🚀
  
  `)
  
);

//Show the error
connection.connect(function (err) {
  if (err) throw err;
});

//Export connection
module.exports = connection;



