const mariadb = require("mariadb");

const pool = mariadb.createPool({
   host: process.env.DB_HOST,
   profile: process.env.DB_USER,
   password: process.env.DB_PASS,
   database: process.env.DB_NAME,
   connectionLimit: 5
});

module.exports = pool;