var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register', { title: 'Register' });
});

router.get('/login', function(req, res, next) {
  res.render('login', { title: 'Login' });
});

router.post('/register', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;

  // Form Validator
  req.checkBody('username', 'Username field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

  // Check Errors
  var errors = req.validationErrors();

  if(errors) {
    res.render('register', {
      errors: errors
    });
  } else {
    console.log('No Errors');
  }
});

module.exports = router;
