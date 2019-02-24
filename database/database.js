var { Pool } = require('pg');
// var util  = require('util');

var pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  ssl: true
});
pool.connect();
pool.on('connect', () => {
  console.log('connected to Postgres');
});

pool.on('disconnect', () => {
  console.log('disconnectd from Postgres');
});

pool.on('error', (err, client) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
});


module.exports = pool;
