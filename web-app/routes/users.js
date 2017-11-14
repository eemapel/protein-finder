var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var waitForPort = require('wait-for-port');

var User = require('../models/user');

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

router.post('/login', passport.authenticate('local', { failureRedirect: '/users/login', failureFlash: 'Invalid username or password' }), function(req, res) {
  waitForPort('bio-engine', 7000, function(err) {
    if (err) throw err;

    req.flash('success', 'You are now logged in');
    res.redirect('/');
  });
});

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new LocalStrategy(function(username, password, done) {
  User.getUserByUsername(username, function(err, user) {
    if (err) throw err;
    if (!user) {
      return done(null, false, { message: 'Unknown User'});
    }
    User.comparePassword(password, user.password, function(err, isMatch) {
      if (err) done(err);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Invalid Password' });
      }
    });
  });
}));

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
    var newUser = new User({
      username: username,
      password: password
    });

    // First check that the user does not exist
    User.find({ username: username }, function(err, docs) {
      if (docs.length) {
        res.render('register', {
          errors: [{ msg: 'User already exists'}]
        });
      } else {
        User.createUser(newUser, function(err, username) {
          if (err) throw err;

          console.log("New user created:", username);
          req.flash('success', 'You are now registered and can login');

          res.location('/');
          res.redirect('/');
        });
      }
    });
  }
});

router.get('/logout', function(req, res) {
  req.logout();
  req.flash('success', 'You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;
