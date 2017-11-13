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
  res.render('index', { title: 'Members' });
});

// Sequence query received?
router.post('/sequence', function(req, res, next) {
  console.log("Sequence is:", req.body.sequence);
  console.log("Username is:", req.user.username);

  // TODO: Some error handling first
  var newSequence = new Sequence({
    username: req.user.username,
    query: req.body.sequence,
    protein: ''
  });

  console.log("Start connection manager..");
  CM.connectionManager();

  // TODO: Only ask to create if does not already exist, otherwise sorting gets mixed up too..
  Sequence.createRecord(newSequence, function(err, sequence) {
    if (err) throw err;

    console.log("New sequence created:", sequence);

    var dict = {};

    Sequence.getRecords(req.user.username, function(err, users) {
       var queries = [];
       for (var i in users) {
         key = users[i].query;
         if (!(key in dict)) {
            dict[key] = {};
            dict[key].queries = [];
         }
         dict[key].queries.push(users[i]._id);
       }
       console.log(dict);
       res.render('index', { queries: users, user: req.user.username || null });
    });
  });
});

module.exports = router;
