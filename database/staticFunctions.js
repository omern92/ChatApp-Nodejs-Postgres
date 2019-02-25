var constants = require('../constants');
var pool = require('./database');
var bcrypt = require('bcrypt');


module.exports = {
  register: async function (username, pass) {
    try {
      let hashedPass = bcrypt.hashSync(pass, 10);
      let sql = 'INSERT INTO users(username, password, room) VALUES($1,$2,1)';
      var values = [username, hashedPass];
      await pool.query(sql, values);
      return true;    

    } catch (err) {
      console.log(err.stack);
    }
  },

  isUsernameFree: async function (username) {
    try {
      var sql = 'SELECT username FROM users WHERE username=$1';
      var values = [username];
      var result = await pool.query(sql, values);
      if (result.rows.length > 0){
        return false;
      }
      return true; 

    } catch(err) {
      console.log(err.stack);
    }
  },

  login: async function (username, password) {
    try {
      var sql = 'SELECT password, room FROM users WHERE username=$1';
      var values = [username];
      var result = await pool.query(sql, values);
      if (result.rows.length > 0) {
        let hashedPass = result.rows[0].password;
        let room       = result.rows[0].room;
        if (bcrypt.compareSync(password, hashedPass)) {
                this.userConnected(username);
                return { success: true, username: username, room: room };
  
        } else  return constants.PASS_WRONG;
  
      } else {
                return constants.USERNAME_WRONG;
      }

    } catch(err) {
      console.error(err.stack);
      return constants.DB_ERROR;
    }
  },
  
  userConnected: async function (username) {
    try {
      var sql = `UPDATE users SET connected=TRUE WHERE username='${username}'`;
      pool.query(sql);
    
    } catch(err) {
      return false;
    }
  },

  userDisconnected: async function (username) {
    try {
      var sql = `UPDATE users SET connected=FALSE WHERE username='${username}'`;
      pool.query(sql);
    
    } catch(err) {
      return false;
    }
  }

};
