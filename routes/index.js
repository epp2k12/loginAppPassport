var express = require('express');
var router = express.Router();

var ensureAuthenticated = function(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }else{
        req.flash('error_msg','You are not LOGGED IN');
        res.redirect('/users/login');
    }
}

//Get Homepage
router.get('/',ensureAuthenticated, function (req,res, next){
 res.render('index');
});



module.exports = router;
