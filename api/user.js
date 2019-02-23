var mapper     = require('../database/staticFunctions');
var constants  = require('../constants');


async function register(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (validateUsername(username) && validatePass(password)) {
    try {
      let response = await mapper.isUsernameFree(username);
      if (response === false) {
        res.json({ result: false, message: constants.REG_USERNAME_EXISTS });
      } else {
        response = await mapper.register(username, password);
        res.json({ result: true, message: constants.REG_SUCCESS });
      }

    } catch(err) {
      res.status(500).json({ result: false, message: constants.DB_ERROR });
    }

  } else if (!validateUsername(username)) {
    res.json({ result: false, message: constants.REG_INVALID_USERNAME });
  } else if (!validatePass(password)) {
    res.json({ result: false, message: constants.REG_INVALID_PASS });
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
      console.log('The sessions saved successfully. room session: ' + req.session.room)
      res.json({ result: true, message: constants.LOGIN_SUCCESS });
    } else {
      res.json({ result: false, message: response });
    }

  } catch(err) {
    res.json({ result: false, message: constants.DB_ERROR });
  }
}


function addFile(req, res) {
  var form = new formidable.IncomingForm();
  form.maxFileSize = 5 * 1024 * 1024;
  form.parse(req);

  form.on('fileBegin', (name, file) => {
      const genName = uuidv1();
      file.path = path.join(__dirname, 'uploads', genName);
  });

  form.on('file', (name, file) => {
    const username = req.session.username;
    const genName = path.basename(file.path);
    userMapper.saveFile(username, genName, file)
      .catch(err => res.status(500).json({ message: constants.DB_ERROR }));
    
    newFile = new File(username, genName, file);
    const response = newFile.isImage();
    if (response) {
      res.json(response);
    } else {
      res.json({ isImage: false, filename: file.name, generatedName: genName })
    }
  });
}


function logout(req, res) {
  req.session.destroy((err) => {
    if (err)
      res.status(500).json(err);
    else 
      res.status(200).json({ message: 'disconnected successfully' });
  })
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