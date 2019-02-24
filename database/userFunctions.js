var constants = require('../constants');
var pool = require('./database');

module.exports = {
  getMessages: async function (roomID) {
    try {
      var sql = 'SELECT username, time, text FROM messages WHERE room=$1 LIMIT 100';
      var values = [roomID];
      var results = await pool.query(sql, values);

      if (results.rows.length == 0) {
        return constants.NO_MESSAGES;
      } else {
        let messages = {};
        for (var i = 0, len = results.rows.length; i < len; i++) {
          let time = new Date(results.rows[i]['time']);
          time.setHours(time.getHours() + 2);
          
          messages[i] = {time: time.toLocaleTimeString(),
                         username: results.rows[i]['username'],
                         text: results.rows[i]['text'] };
        }
        return messages;
      }

    } catch(err) {
      console.log(err.stack);
      return constants.DB_ERROR;

    }
  },

  addMessage: async function (username, text, roomID) {
    try {
      var sql = 'INSERT INTO messages VALUES(DEFAULT,$1,DEFAULT,$2,$3)';
      var values = [username, text, roomID];
      await pool.query(sql, values);
      return true;

    } catch(err) {
      console.log(err.stack);
      return constants.DB_ERROR;
    }
  },

  getRooms: async function () {
    try {
      var sql = 'SELECT id, name FROM rooms';
      var results = await pool.query(sql);
      let rooms = {};
      for (var i = 0, len = results.rows.length; i < len; i++) {
        rooms[i] = {id: results.rows[i]['id'], name: results.rows[i]['name'] };
      }
      return rooms;

    } catch(err) {
      console.log(err.stack);
      return constants.DB_ERROR;
    }
  },

  changeRoom: async function (roomID, username) {
    try {
      var sql = 'UPDATE users SET room=$1 WHERE username=$2';
      var values = [roomID, username];
      await pool.query(sql, values);
    
      return true;
    } catch(err) {
      console.log(err.stack);
      return constants.DB_ERROR;
    }
  },
  
  roomExists: async function (roomName) {
    try {
      var sql = 'SELECT name FROM rooms WHERE name=$1';
      var values = [roomName]
      var result = await pool.query(sql, values);
      if (result.rows.length == 0) {
        return false;
      } else {
        return true;
      }

    } catch(err) {
      console.log(err.stack);
      return constants.DB_ERROR;
    }
  },
  
  addRoom: async function (roomName) {
    try {
      var sql = 'INSERT INTO rooms VALUES(DEFAULT, $1) RETURNING *';
      var values = [roomName];
      var result = await pool.query(sql, values);
      return   { success: true, id: result.rows[0].id }   
         
    } catch(err) {
      console.log(err.stack);
      return   { success: false };
    }
  },

  getUsers: async function(roomID) {
    try {
      var sql = 'SELECT username FROM users WHERE room=$1 AND connected=TRUE';
      var values = [roomID];
      var results = await pool.query(sql, values);
      users = [];
      for (var i = 0, len = results.rows.length; i < len; i++) {
        users.push(results.rows[i]);
      }
      return users;

    } catch(err) {
      console.log(err.stack);
      return constants.DB_ERROR;
    }
  },

  saveFile: async function (username, genName, file) {
    try {
      var sql = 'INSERT INTO files(username, original_name, gen_name, size, ext) VALUES($1,$2,$3,$4,$5)';
      var values = [username, file.name, genName, file.size, file.type];
      await pool.query(sql, values);
      return true;

    } catch(err) {
      console.log(err.stack);
      return constants.DB_ERROR;
    }
  }
};