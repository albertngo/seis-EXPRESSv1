let { Pool, Client } = require("pg");

let postgres;

if (process.env.NODE_ENV === "production") {
  postgres = new Pool({
    connectionString: process.env.CONNECTION_STRING,
  });
} else {
  postgres = new Pool({
    host: "postgresDB",
    port: 5432,
    user: "postgres",
    password: "Thisisngo1995!",
    database: "myDB",
  });
}

module.exports = postgres;
