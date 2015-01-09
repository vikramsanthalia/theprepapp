/**
 * Express Backend Server
 */

 var path = require('path');

//Ensure we always start the server from parent dir
process.chdir(path.join(__dirname, '..'));

var http = require('http');
var https = require('https');
var timed = require('timed');
var fs = require('fs');
var sessions = require("client-sessions");
var bodyParser = require('body-parser');
var express = require('express');
var _ = require('lodash');
var loginInfo = require('./login-info');
var API_BASE = "/-/api/";

var env = process.env.NODE_ENV;

/*config*/
var conf = {
  signedCookieSess : sessions({
    cookieName: 'prep.sess3', // cookie name dictates the key name added to the request object
    requestKey: 'session', // requestKey overrides cookieName for the key name added to the request object.
    secret: "*&(*IKL>{_()R^&IUJ#!@#$SB(()P)_)*&^%%%%%(&*^g^%vbsi76ou>:LCFjfdw7b29vz6HTadj27%!@#$%%^&", // should be a large unguessable string
    duration: 2 * 60 * 1000, // how long the session will stay valid in ms. ie every x duration, we will update the cookie
    activeDuration: 1000 * 60 * 15 // 1000 * 60 * 15if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
  })
};
/*config*/


var app = express();
app.enable('trust proxy');

var httpServer = http.createServer(app);

app.configure('production', function () {
  app.use(function requireHTTPS(req, res, next) {
    if (!req.secure) {
      //FYI this should work for local development as well
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
  });
});

app.configure('stage', function () {
  app.use(function requireHTTPS(req, res, next) {
    if (!req.secure) {
      //FYI this should work for local development as well
      return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
  });
});

app.configure(function() {
  app.set('case sensitive routing', true);
  app.use(express.logger('dev'));
  app.use(express.compress());
  app.use(bodyParser.json());
  app.use(conf.signedCookieSess);
  app.use(express.favicon('client/_build/assets/favicon.ico'));
  app.use('/assets', express.static('client/_build/assets'), {
    maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
  });
  app.use('/ext', express.static('client/_build/src/ext'), {
    maxAge: 90 * 24 * 60 * 60 * 1000 // 90 days
  });
});

app.get('/', function(req, res, next) {
  res.sendfile('client/_build/index.html', function(err) {
    if(err) { next(err); }
  });
});

app.post(API_BASE + 'login', postLogin);
app.get(API_BASE + 'user-info', getLogin);
app.get(API_BASE + 'partnerDash', verifyAccess, getPartnerDash);
app.get(API_BASE + 'logout', getLogout);

var port = 3000;
httpServer.listen(port, function () {
  console.log('Server dir: "' + process.cwd() + '"');
  console.log('Using node version: ' + process.version);
  console.log('Using NODE_ENV: ' + process.env.NODE_ENV)
  console.log('Using lookup paths: \n\t' + '\u001b[33m' + module.paths.join('\n\t') + '\u001b[39m');
  console.log('Nodejs path: ' + process.execPath);
  console.log("Express http server listening on port " + port);
  console.log('\u001b[32m' + 'Server started in ' + timed.since().toFixed() + ' ms.' + '\u001b[39m');
});


function postLogin(req, res, next){
  var username = req.body.username;
  var userpass = req.body.password;

  if(!loginInfo[username] || loginInfo[username]["password"] !== userpass) {
    var error = 'Oh no! Username or password is wrong.';
    return res.json(401, error);
  }
  else{
    req.session.user = {
      username: username
    };
    console.log("postLogin:",req.session.user);
    
    return res.json({
      status: 'OK',
      results: req.session.user
    });
  }
}

function getLogin(req, res, next){

  console.log("getLogin:",req.session.user);

  if(!req.session.user) {
    return res.json({
      status: '401',
      results: 'Please login again.'
    });
  }
  else{
    return res.json({
      status: 'OK',
      results: req.session.user
    });
  }
}

function verifyAccess(req, res, next) {

  /*if(!req.session.user) {
    return res.json(401, "Unauthorized");
  }

  next();*/

  if(req.session.user) return next();

  return res.format({
    json: function() {
      res.json(401, "Unauthorized")
    },
    html: function() {
      res.redirect('/')
    }
  });
}

function getPartnerDash(req, res, next){
  var queryUser = req.query.partner;

  if(queryUser){
    setTimeout(function(){
      return res.status(200).json({
        status: 'OK',
        results: req.session.user
      });
    }, 5000);
  }
  else{
    return res.json({
      status: '401',
      results: 'Unauthorized.'
    });
  }

  
  
}

function getLogout(req, res){
  req.session.user = null;
  return res.status(200).end();
}