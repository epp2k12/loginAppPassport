var express = require('express');
var router = express.Router();
var User = require('../models/user');


var ensureAuthenticated = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }else{
        //req.flash('error_msg','You are not LOGGED IN');
        res.redirect('/users/login');
    }
}

module.exports = function(passport) {

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//Register
router.get('/register', function (req,res, next){
 res.render('register');
});

//Login
router.get('/login', function (req,res, next){
 res.render('login');
});

//Post Register
router.post('/register', function (req,res, next){
 // console.log("so you want to register!");
 // res.send("You are now about to register!");
 
 var name = req.body.name;
 var email = req.body.email;
 var username = req.body.username;
 var password = req.body.password;
 var password2 = req.body.password2;

 //Validation
 req.checkBody('name', 'Name is Required').notEmpty();
 req.checkBody('email', 'Email is Required').notEmpty();
 req.checkBody('email', 'Email is not valid').isEmail();
 req.checkBody('username', 'Username is Required').notEmpty();
 req.checkBody('password', 'Password is Required').notEmpty();
 req.checkBody('password2', 'Passwords don not match').equals(req.body.password);
 
 req.getValidationResult().then (function(result){

    if(result.isEmpty()) {
        console.log("hurray there is no error");
        var newUser = new User ({
            name: name,
            email: email,
            username: username,
            password: password
        });
        newUser.createUser(function(err, user){
            if(err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are now registered!');
        res.redirect('/users/login')

    }else{
     let errors = result.array();
     console.log(errors);
     res.render('register',{
         err: errors
     });

   }
});

});


router.post('/login',
  passport.authenticate('local', { successRedirect: '/',
                                   failureRedirect: '/users/login',
                                   failureFlash: true }),
  function(req, res) {
    //res.redirect('/');
});

router.get('/logout', function(req, res, next) {
  req.logout();

  req.flash('success_msg', 'You are now logged out!');
  res.redirect('/users/login');

});

router.get('/profile', ensureAuthenticated, function(req, res, next) {
 res.send('WARNING : you are viewing a secured area!');
});

return router;

}

