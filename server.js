'use strict';
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        xoauth2: xoauth2.createXOAuth2Generator({
            user: 'tom.ahrens.dev@gmail.com',
            pass: 'centraltimezone',
            clientId: '129257487284-0c525i0a9oor2ig03t2nlnb8j6pq4gom.apps.googleusercontent.com',
            clientSecret: 'XyUTul3gfFSSpPans8yLuhTR',
            refreshToken: '1/1PbDAPD_NVPUmd1t8zdDnGHpxt9TLCZnJi_FLXftU_w',
        })
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: 'Tom Ahrens <tom.ahrens.dev@gmail.com>', // sender address
    to: 'softdev.zeus@gmail.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});

var fs = require('fs');
var admin = require("firebase-admin");
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var Cryptr = require('cryptr');
var app = express();

var variable = "9{nPy413xs1)*qi9rIt%6327rR2mHq";
var cryptr = new Cryptr(variable);

admin.initializeApp({
  credential: admin.credential.cert("viven-health-7f33c-firebase-adminsdk-r8tun-8b9b703c4b.json"),
  databaseURL: "https://viven-health-7f33c.firebaseio.com"
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use('/fonts', express.static(__dirname + '/assets/fonts'));
app.use('/images', express.static(__dirname + '/assets/images'));
app.use('/src', express.static(__dirname + '/server/src'));
app.use('/client', express.static(__dirname + '/client'));

// app.post('/getUser', function(req, res){
//     res.end('Hello');
// });

app.get('/login', function(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    var html = new Buffer(fs.readFileSync('server/index.html')).toString();
    res.end(html);
});

app.post('/getUser', function(req, res, next) {
    //console.log('ON SERVER:');

    var userToMatch = req.body.email;
    var userToReturn = {};
    // console.log(req.body);
    //return back the userData that matches the email address
    for (var i = 0; i < allUserObjects.length; i++) {
       if (userToMatch === allUserObjects[i].email) {
           userToReturn = allUserObjects[i];
           break;
       }
    }

    console.log(userToMatch);
    //res.json(200, userInfo);

    res.status(200).json(userToReturn);
});

app.post('/getVar', function(req, res) {
    console.log("user_id is:  " + req.body.id);
    var encryptedVar = cryptr.encrypt(req.body.id);
    console.log("Encrypted user_id is:  " + encryptedVar);
    res.status(200).json({id: encryptedVar});
});

app.get('/', renderLandingPage);

// var loggedInUsers = [];
var allUserObjects = [];

function renderLandingPage(req, res) {
    if (req.cookies.idToken) {
        admin.auth().verifyIdToken(req.cookies.idToken)
        .then(function(decodedToken) {
            // var uid = decodedToken.uid;
            // console.log(JSON.stringify(decodedToken));
            var userID = decodedToken.user_id;
            // loggedInUsers.push(userID);
            var email = decodedToken.email;
            var name = decodedToken.name;
            var picture = decodedToken.picture;
            // console.log(decodedToken);
            var userInfoObject = {
                id : userID,
                email : email,
                name : name,
                picture : picture
            };

            userInfo = userInfoObject;
            allUserObjects.push(userInfoObject);
            //console.log(userInfo);
            res.writeHead(200, {'Content-Type': 'text/html'});
            var html = new Buffer(fs.readFileSync('client/index.html')).toString();
            res.end(html);
        }).catch(function(error) {
            // console.log('login error');
            res.redirect('/login');
        });
    } else {
        // console.log('login error');
        res.redirect('/login');
    }
}

console.log('App is running on port ' + (process.env.PORT || 9000));
app.listen(process.env.PORT || 9000); // both locally and on heroku