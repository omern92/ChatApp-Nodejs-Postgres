var express    = require('express');
var path       = require('path');
var formidable = require('formidable');
var path       = require('path');
var uuidv1     = require('uuid/v1');
var File       = require('../classes/fileClass');
var userMapper = require('../database/userFunctions');

var router    = express.Router();


router.get('/:filename', authChecker, (req, res) => {
  fileName = req.params.filename;
  var file = path.join(__dirname, '../', 'uploads', fileName);
  res.download(file);
});





function authChecker(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(403).json({
      message: 'You must be logged in.'
    });
  }
}

module.exports = router;