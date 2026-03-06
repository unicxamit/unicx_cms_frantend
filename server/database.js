const mysql = require("mysql2");
require('dotenv').config();

let db;

function handleDisconnect() {
  db = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "unicxdb",
    port: Number(process.env.DB_PORT || 3306),
  });
  

  db.connect((err) => {
    if (err) {
      console.error("Database connection failed: ", err);
      setTimeout(handleDisconnect, 2000); // Retry after 2s
    } else {
      console.log("Connected to MySQL database.");
    }
  });

  db.on("error", (err) => {
    console.error("MySQL error", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST" || err.fatal) {
      handleDisconnect(); // Reconnect
    } else {
      throw err;
    }
  });
}

handleDisconnect();

module.exports = db;
