var constants = require('../constants');
var pool = require('./database');

module.exports = {
  getMessages: async function (roomID) {
    try {
      var sql = 'SELECT username, time, text FROM messages WHERE room=? LIMIT 100';
      var results = await pool.query(sql, roomID);

      if (results.length == 0) {
        return constants.NO_MESSAGES;
      } else {
        let messages = {};
        for (var i = 0, len = results.length; i < len; i++) {
          messages[i] = {time: new Date(results[i]['time']).toLocaleTimeString(), username: results[i]['username'], text: results[i]['text'] };
        }
        return messages;
      }

    } catch(err) {
      return err;
    }
  },

  addMessage: async function (username, text, roomID) {
    try {
      var sql = 'INSERT INTO messages VALUES(NULL,?,DEFAULT,?,?)';
      var values = [username, text, roomID];
      var result = await pool.query(sql, values);
      return true;

    } catch(err) {
      return err;
    }
  },

  getRooms: async function () {
    try {
      var sql = 'SELECT id, name FROM rooms';
      var results = await pool.query(sql);

      let rooms = {};
      for (var i = 0, len = results.length; i < len; i++) {
        rooms[i] = {id: results[i]['id'], name: results[i]['name'] };
      }
      return rooms;

    } catch(err) {
      return err;
    }
  },

  changeRoom: async function (roomID, username) {
    try {
      var sql = 'UPDATE users SET room=? WHERE username=?';
      var values = [roomID, username];
      pool.query(sql, values);
    
      return true;
    } catch(err) {
      return false;
    }
  },
  
  roomExists: async function (roomName) {
    try {
      var sql = 'SELECT name FROM rooms WHERE name=?';
      var result = await pool.query(sql, roomName);
      if (result.length == 0) {
        return false;
      } else {
        return true;
      }

    } catch(err) {
      return err;
    }
  },
  
  addRoom: async function (roomName) {
    try {
      var sql = 'INSERT INTO rooms VALUES(NULL, ?)';
      var result = await pool.query(sql, roomName);
      return   { success: true, id: result.insertId }   
         
    } catch(err) {
      return   { success: false };
    }
  },

  getUsers: async function(roomID) {
    try {
      var sql = 'SELECT username FROM users WHERE room=? AND connected=1';
      var results = await pool.query(sql, roomID);
      users = [];
      for (var i = 0, len = results.length; i < len; i++) {
        users.push(results[i]);
      }
      return users;

    } catch(err) {
      return false;
    }
  },

  saveFile: async function (username, genName, file) {
    try {
      var sql = 'INSERT INTO files(username, original_name, gen_name, size, ext) VALUES(?,?,?,?,?)';
      var values = [username, file.name, genName, file.size, file.type];
      var result = await pool.query(sql, values);

    } catch(err) {
      return err;
    }
  }
};