var User = require('../models/user');
var users = require('../routes/users');

var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function(err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username' });
      }

    //=========== change this portion     
    user.validPassword(password, function(err, isMatch){
      if(err) throw err;
      if(isMatch) {
        console.log(user);
        return done(null, user, { message: 'Welcome to the Jungle'});
      }else{
        return done(null, false, { message: 'Incorrect password'});
      }
     });
    });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});




}

