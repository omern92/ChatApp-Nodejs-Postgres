var mapper     = require('../database/staticFunctions');
var userMapper     = require('../database/userFunctions');
var constants  = require('../constants');
var formidable = require('formidable');
var uuidv1     = require('uuid/v1');
var File       = require('../classes/fileClass');
var path       = require('path');
var fs         = require('fs');

async function register(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  const validated = await validateCred(username, password);
  if (validated.result === false) {
        res.json({ result: false, message: validated.message });  
  } 
  else {
    const response = await mapper.register(username, password);
    if (response) {
        res.json({ result: true, message: constants.REG_SUCCESS });
    } else {
        res.json({ result: false, message: constants.DB_ERROR });
     }
  }
}


async function login(req, res) {
  if (!req.body.username || !req.body.password) {
    res.json({ result: false, message: constants.FIELDS_REQ });
  }
  try {
    var username = req.body.username;
    var password = req.body.password;
    var response = await mapper.login(username, password);
    if ( response.success ) {
      req.session.username = username;
      req.session.room     = response.room;
      res.json({ result: true, message: constants.LOGIN_SUCCESS });
    } else {
      res.json({ result: false, message: response });
    }

  } catch(err) {
    res.json({ result: false, message: constants.CONN_ERROR });
  }
}


async function addFile(req, res) {
  var form = new formidable.IncomingForm();
  form.maxFileSize = 5 * 1024 * 1024;
  form.parse(req);

  form.on('fileBegin', (name, file) => {
      const genName = uuidv1();
      const uploadsPath = path.join(__dirname, 'uploads');
      const filePath = path.join(__dirname, 'uploads', genName);

      fs.access(uploadsPath, (err) => {
        if (err)
          fs.mkdirSync(uploadsPath);
      });
      file.path = filePath;
  });

  form.on('file', async (name, file) => {
    const username = req.session.username;
    const genName = path.basename(file.path);
    let response = await userMapper.saveFile(username, genName, file);
    if (!response) {
      res.status(500).json({ message: response })
    } 
    
    newFile = new File(username, genName, file);
    response = newFile.isImage();
    if (response) {
      res.json(response);
    } else {
      res.json({ isImage: false, filename: file.name, generatedName: genName })
    }
  });
}


async function validateCred(username, password) {
  if (validateUsername(username) && validatePass(password)) {
    try {
      let response = await mapper.isUsernameFree(username);
      if (response === false) 
        return { result: false, message: constants.REG_USERNAME_EXISTS };
      else if (response === true)
        return { result: true }; // username available.
      else
        return { result: false, message: constants.DB_ERROR };

    } catch(err) {
      return { result: false, message: constants.CONN_ERROR };
    }

  } else if (!validateUsername(username)) 
      return { result: false, message: constants.REG_INVALID_USERNAME };
   else if (!validatePass(password)) 
      return { result: false, message: constants.REG_INVALID_PASS };
  
}


function logout(req, res) {
  if (req.session.username) {
    req.session.destroy((err) => {
      if (err)
        res.status(200).json(err);
      else 
        res.status(200).json({ message: 'disconnected successfully' });
    });
  } else {
    res.status(200).json({ message: 'You are not logged in' });
  }

}



function isLoggedIn(req, res) {
  req.session.username ? res.json({ loggedIn: true }) : res.json({ loggedIn: false });
}


function validateUsername (username) {
  if (username.length < 3 || !username.toString().match(/^[a-zA-Z0-9]+$/)) {
    return false;
  } 
  else return true;
}

function validatePass (password) {
  if (password.length < 3) return false;
  else return true;
}

module.exports = { register, login, addFile, logout, isLoggedIn }