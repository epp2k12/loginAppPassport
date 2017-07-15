var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var Schema = mongoose.Schema;

var UserSchema = new Schema ({

    username: {
    type: String,
    index: true
    },
    password: {
    type: String
    }, 
    email: {
    type: String
    },
    name: {
    type: String
    }

});

UserSchema.methods.validPassword = function( password, callback) {
    bcrypt.compare(password, this.password, function(err, isMatch) {
        console.log("the isMatch : " + isMatch);
        if(err) throw err;
        callback(null, isMatch);
    });
}

UserSchema.methods.createUser = function(callback) {
    //use bcrypt to hash password
    bcrypt.genSalt(10, function(err,salt){
        bcrypt.hash(newUser.password, salt, function(err,hash){
            //store hash in your db
            this.password = hash;
            this.save(callback);
        });
    });
}

UserSchema.methods.try = function() {
    return "Hey i am returned!";
}

var User = mongoose.model('User',UserSchema);
module.exports = User;

/*
module.exports.validMyPassword = function(password, hash, callback) {
    bcrypt.compare(password, hash, function(err, isMatch) {
        console.log("the isMatch : " + isMatch);
        callback(null, isMatch);
    });    
}

module.exports.createUser = function(newUser, callback) {
    //use bcrypt to hash password
    bcrypt.genSalt(10, function(err,salt){
        bcrypt.hash(newUser.password, salt, function(err,hash){
            //store hash in your db
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

*/
