var { Pool } = require('pg');
var util  = require('util');

const connectionString = process.env.DATABASE_URL;
var pool = new Pool({
  connectionString: connectionString,
});

pool.getConnection((err, connection) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed.')
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections.')
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused.')
    }
  }
  if (connection) {
    connection.release()
  }
})

pool.query = util.promisify(pool.query);

module.exports = pool
