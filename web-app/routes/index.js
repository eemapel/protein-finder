var express = require('express');
var router = express.Router();

var Sequence = require('../models/sequence');
var CM = require('../libs/engine-connection');

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/users/login');
}

/* GET home page. */
router.get('/', ensureAuthenticated, function(req, res, next) {
  Sequence.getRecords(req.user.username, function(err, users) {
    res.render('index', { title: 'Members', queries: users, user: req.user.username || null });
  });
});

// Sequence query received?
router.post('/sequence', function(req, res, next) {
  // If username not defined, direct to login screen first
  if (req.user.username == undefined) {
    res.redirect('/users/login');
  }

  console.log("Sequence is:", req.body.sequence);
  console.log("Username is:", req.user.username);
  console.log("Start connection manager..");

  CM.connectionManager(req.user.username, req.body.sequence, function() {
    Sequence.getRecords(req.user.username, function(err, users) {
      res.render('index', { queries: users, user: req.user.username || null });
    });
  });
});

module.exports = router;
