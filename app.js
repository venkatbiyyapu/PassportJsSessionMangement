var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session');
var express = require('express');
var ejs = require('ejs');
var createError = require('http-errors');
var path = require('path');
var Account = require('./models/account');
var app = express();
var PORT = 3000;
var error;
var message='';
const mongoURI = 'mongodb://localhost:27017';

mongoose.connect(`${mongoURI}/SessionManagement`, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: false
}));

passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.use(passport.initialize());
app.use(passport.session());

app.get("/", function (req, res) {
  res.redirect("/login");
});

app.get("/login", function (req, res) {
  if(req.isAuthenticated()){
    console.log("i am here")
     message=""
  }
  res.render("login", { message,error });
});

app.get("/signup", function (req, res) {
  res.render("signup", { error });
});

app.post('/signup', (req, res) => {
  const { username, email, password, phone, address } = req.body;
  Account.register(new Account({ username, email, phone, address }), password.toString(), (err) => {
    if (err) {
      if(err.message.includes("email"))
        return res.render('signup', { error:"User can't be registered as an email already exists, please try again using different email!!" });
      else
      return res.render('signup', { error: err.message });
    }
    if(req.isAuthenticated()){
      return res.render('signup', { error: "You cannot register the user, please log out first!!!" });
    }
    passport.authenticate('local')(req, res, () => {
      res.redirect('/login');
    });
  });
});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.render('login', { message:"",error: 'Invalid Username or Password' });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect('/welcome');
    });
  })(req, res, next);
});

app.use((req, res, next) => {
  if (req.isAuthenticated()) {
    req.session.lastActivity = Date.now();
  }
  next();
});

app.get("/welcome", isLoggedIn, function (req, res) {
  const username = req.user.username;
  res.render("welcome", { username });
});

app.post('/logout', function (req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

app.get('/logout', isLoggedIn, function (req, res) {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    // message="User is Logged Out, Require Re-Login"
    message="You are logged out, please login again!!";
    return next();
  } else {
    const err = createError(401, 'You cannot access this page without logging in!!!!');
    next(err);
  }
}

app.use(function (err, req, res, next) {
  if (err.status === 401) {
    res.status(401).render('error', { error: err.message });
  } else {
    next(err);
  }
});



app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', { error: err.message });
});

app.use(express.static(path.join(__dirname,'public')));

app.listen(PORT, function () {
  console.log('Server is running on port ' + PORT);
});
