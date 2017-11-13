var mongoose = require('mongoose');

// TODO: Use docker alias
mongoose.connect('mongodb://localhost/proteinfinder');

var db = mongoose.connection;

// Sequence Schema
var SequenceSchema = mongoose.Schema({
    username: {
      type: String,
    },
    query: {
      type: String
    },
    protein: {
      type: String
    }
  }, {
    autoindex: true
  }
);

var Sequence = module.exports = mongoose.model('Sequence', SequenceSchema);

module.exports.createRecord = function(newSequence, callback) {
   newSequence.save(callback);
};

module.exports.getRecords = function(username, callback) {
  Sequence.find({ username: username }).exec(callback);
};

