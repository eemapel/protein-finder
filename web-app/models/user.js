var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/proteinfinder');

var db = mongoose.connection;

// User Schema
var UserSchema = mongoose.Schema({
  username: {
    type: String,
    index: true
  },
  password: {
    type: String
  }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback) {
  newUser.save(callback);
};

