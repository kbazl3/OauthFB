var express = require('express');
// var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var Keys = require('./keys.js');

var app = express();

app.use(session({secret: 'anything'}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new FacebookStrategy({ //passport, you are going to use a new facebook strategy
  clientID: Keys.facebook_clientId,// id provided by fb
  clientSecret: Keys.facebook_secret,//secret provided by fb
  callbackURL: 'http://localhost:3000/auth/facebook/callback'// we are leaving our server so facebook has to know where  to come back too. there is an endpoint for this on line 24
}, function(token, refreshToken, profile, done) { //this is where you get the info back from facebook.  This is where you can check with mongo to see if you have a user with this
    //fb id.  If there are not matches then you could create a new user profile
  return done(null, profile);//done is like next in express
}));

app.get('/auth/facebook', passport.authenticate('facebook'));//Step 1. default endpoint that is calling

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/me', //if facebook gave back a green light we go here
	failureRedirect: '/login'//if there was an error we go here
}), function(req, res) {
	console.log(req.session);
});

passport.serializeUser(function(dataToSerialize, done) {
    done(null, dataToSerialize);
});

passport.deserializeUser(function(dataFromSessionToPutOnReqDotUser, done) {
    done(null, dataFromSessionToPutOnReqDotUser);
});

app.get('/me', function(req, res) {
    res.send(req.user);
});


app.listen('3000', function(){
    console.log('listening on 3000');
});
