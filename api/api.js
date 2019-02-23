var express    = require('express');
var user       = require('./user');
var setup      = require('../setup');
var router    = express.Router();

router.get('/register', user.isLoggedIn);
router.post('/register', isLoggedinMid, user.register);


router.get('/login', user.isLoggedIn);
router.post('/login', isLoggedinMid, user.login);

router.get('/js', setup);
router.post('/addFile', authChecker, user.addFile);


router.get('/logout', authChecker, user.logout);








function authChecker(req, res, next) {
  if (req.session && req.session.username) {
    next();
  } else {
    res.status(403).json({
      message: 'You must be logged in.'
    });
  }
}

function isLoggedinMid(req, res, next) {
  if (req.session && req.session.username) {
    res.status(403).json({ loggedIn: true, message: 'You are already logged in.' });
  } else {
    next();
  }
}


module.exports = router;