let { Pool, Client } = require("pg");

let postgres = new Pool({
  user: "postgres",
  password: "Thisisngo1995!",
  host: "locahost",
  port: 5432,
  database: "postgres",
  max: 20,
  connectionTimeoutMillis: 0,
  idleTimeoutMillis: 0,
});

module.exports = postgres;
