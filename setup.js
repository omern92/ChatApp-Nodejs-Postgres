var pool = require('./database/database');

(async function createTableRooms () {
  try {
    var sql = 'CREATE TABLE IF NOT EXISTS rooms (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(30))';
    var result = await pool.query(sql);
  } catch (err) {
    console.log(err);
  }
}());

(async function createTableUsers () {
  try {
    var sql = 'CREATE TABLE IF NOT EXISTS users (username VARCHAR(30) UNIQUE,password VARCHAR(255),id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,room INT UNSIGNED DEFAULT "1",FOREIGN KEY (room) REFERENCES rooms(id) ON UPDATE CASCADE)';
    var result = await pool.query(sql);
  } catch (err) {
    console.log(err);
  }
}());

(async function createTableMessages () {
  try {
    var sql = 'CREATE TABLE IF NOT EXISTS messages (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,username VARCHAR(30),time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,text TEXT,room INT UNSIGNED,FOREIGN KEY (room) REFERENCES rooms(id) ON UPDATE CASCADE,FOREIGN KEY (username) REFERENCES users(username))';
    var result = await pool.query(sql);
  } catch (err) {
    console.log(err);
  }
}());

(async function createTableFiles () {
  try {
    var sql = 'CREATE TABLE IF NOT EXISTS files (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,username VARCHAR(30),time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,original_name VARCHAR(100),gen_name VARCHAR (20),size INT UNSIGNED,ext VARCHAR(10),FOREIGN KEY (username) REFERENCES users(username))';
    var result = await pool.query(sql);
  } catch (err) {
    console.log(err);
  }
}());


process.exit();
