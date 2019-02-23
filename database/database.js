var { Pool } = require('pg');
var util  = require('util');

const connectionString = process.env.DATABASE_URL;
var pool = new Pool({
  connectionString: connectionString,
});


pool.query = util.promisify(pool.query);

module.exports = pool
