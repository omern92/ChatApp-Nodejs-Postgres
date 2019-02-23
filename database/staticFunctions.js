var constants = require('../constants');
var pool = require('./database');
var bcrypt = require('bcrypt');


module.exports = {
  register: async function (username, pass) {
    try {
      let hashedPass = bcrypt.hashSync(pass, 10);
      let sql = 'INSERT INTO users(username, password, id, room) VALUES(?,?,NULL,"1")';
      var values = [username, hashedPass];
      var result = await pool.query(sql, values);

      return true;    

    } catch (err) {
      return err;
    }
  },

  isUsernameFree: async function (username) {
    try {
      var sql = 'SELECT username FROM users WHERE username=?';
      var result = await pool.query(sql, username);
      if (result.length > 0){
        return false;
      }
      else {
        return true; 
      }

    } catch(err) {
      return err;
    }
  },

  login: async function (username, password) {
    try {
      var sql = 'SELECT password, room FROM users WHERE username=?';
      var result = await pool.query(sql, username);
    
      if (result.length > 0) {
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
      return err;
    }
  },
  
  userConnected: async function (username) {
    try {
      var sql = `UPDATE users SET connected=1 WHERE username="${username}"`;
      pool.query(sql);
    
    } catch(err) {
      return false;
    }
  },

  userDisconnected: async function (username) {
    try {
      var sql = `UPDATE users SET connected=0 WHERE username="${username}"`;
      pool.query(sql);
    
    } catch(err) {
      return false;
    }
  }

};
