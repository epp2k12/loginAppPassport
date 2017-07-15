var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
var exphbs = require("express-handlebars");
var expressValidator = require("express-validator");
var flash = require("connect-flash");
var session = require("express-session");
var passport = require("passport");
var LocalStrategy = require("passport").Strategy;
var mongo = require("mongodb");
const config = require('./config/database');
var mongoose = require("mongoose");
mongoose.connect(config.database, function (){
    console.log("Connected to database " + config.database);
});
var db = mongoose.connection;

var app = express();

//View Engine
app.set('views', path.join(__dirname,'views'));
app.engine('handlebars', exphbs({defaultLayout: 'myLayout'}));
app.set('view engine', 'handlebars');

//Body Parser Middleware
//app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cookieParser());

//Set Static Folder
app.use(express.static(path.join(__dirname,'public')));

//Express Session
app.use(session({
 secret: config.secret,
 saveUninitialized: true,
 resave: true
}));


//Initialize Passport ?????
app.use(passport.initialize());
app.use(passport.session());

//Express Validator
app.use(expressValidator({
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash Middleware
app.use(flash());

//Initialize Passport *******
var initPassword = require('./passport/init');
initPassword(passport);


var routes = require('./routes/index');
var users = require('./routes/users')(passport);

// Global Variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user;
    next();
});

app.use('/', routes);
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port')); 
});



























