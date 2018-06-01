var express = require('express');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var app = express();

const MongoClient = require('mongodb').MongoClient
var env = require(__dirname + '/env-vars.js');
var gmail_login = env.gmail_login;
var gmail_pass = env.gmail_pass;
var db;
// var router = express.Router();
var mongo = require('mongodb');
var session = require('express-session')

app.use(express.json()); //convert req to json
app.use(express.static(__dirname + '/app'));

//use sessions for tracking logins
// app.use(session({
//   secret: 'girlsrock',
//   resave: true,
//   saveUninitialized: false
// }));

var allPages = ['/home','/what-we-do','/organization','/faces','/faq','/news','/contact','/become-member','/member-app','/volunteer-to-drive','/volunteer-app','/family','/member-programs','/pay-online','/donate','/corporate', 'non-rider-member','/dashboard','/login', '/view-form','/draft'];

MongoClient.connect('mongodb://itnadmin:itnUser0136!@ds263639.mlab.com:63639/itnamerica', function(err, client) {
  if (err) { 
    console.log('db not connecting, but inside mongo block', err);
  };
  db = client.db('itnamerica');
  
app.post('/sendmail', function(req, res){
  console.log('post req', req.body);

    let transporter = nodemailer.createTransport(smtpTransport({
       service: "Gmail",  // sets automatically host, port and connection security settings
       auth: {
           user: gmail_login,
           pass: gmail_pass
       }
    })
  )
  let mailOptions = {};
  if (req.body && req.body.pdf){
    console.log('sending email with pdf, membership, volunteer or non-rider forms');
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line   
        text: JSON.stringify(req.body.text), // plain text body
        attachments: [{path: req.body.pdf}]
    };

  }
  else if (req.body && req.body.html){
    console.log('sending email without pdf, contact form');
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line   
        text: JSON.stringify(req.body.text), // plain text body
        html: req.body.html // html body
    };
  } else {
    console.log('sending email with neither');
    mailOptions = {
        from: req.body.from, // sender address
        to: req.body.to, // list of receivers
        subject: req.body.subject, // Subject line   
        text: JSON.stringify(req.body.text), // plain text body
    };
  }

    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // transporter.close();
    });
    
    console.log('starting mongo block');

      
      var objWithPDF; var pdfVal;
      if ((req.body && req.body.pdf) && (req.body.formType === 'membership')) {
        objWithPDF = req.body.text;
        objWithPDF.pdf = req.body.pdf;
        db.collection('memberapp').save(objWithPDF, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err); }
          console.log('member app saved to database', result);
          res.redirect('/');
        })
      }
      else if ((req.body && req.body.pdf) && (req.body.formType === 'volunteer')) {
        objWithPDF = req.body.text;
        objWithPDF.pdf = req.body.pdf;
        db.collection('volunteerapp').save(objWithPDF, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('volunteer app saved to database', result);
          res.redirect('/');
        })
      }
      else if ((req.body && req.body.pdf) && (req.body.formType === 'nonrider')) {
        objWithPDF = req.body.text;
        objWithPDF.pdf = req.body.pdf;
        db.collection('nonriderapp').save(objWithPDF, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('nonrider app saved to database', result);
          res.redirect('/');
        })
      }
      else if ((req.body && req.body.html) && (req.body.formType === 'contact')) {
        db.collection('contactform').save(req.body.text, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('contact form saved to database', result);
          res.redirect('/');
        })
      }
      else if ((req.body && req.body.html) && (req.body.formType === 'newsletter')) {
        db.collection('newsletterform').save(req.body.text, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('newsletter form saved to database', result);
          res.redirect('/');
        })
      }
    
    console.log('after mongo block');
    res.end();
  }); // end /sendmail post request
  
  app.get('/getMemberApps', function (req,res) {
      db.collection('memberapp').find().toArray(function (err, result) {
        console.log('result is ', result);
        res.send(result);
      })
  }); // end of /getMemberForms get request
  
  app.get('/getVolunteerApps', function (req,res) {
      db.collection('volunteerapp').find().toArray(function (err, result) {
        console.log('result is ', result);
        res.send(result);
      })
  }); // end of /getVolunteerForms get request
  
  app.get('/getNonRiderApps', function (req,res) {
      db.collection('nonriderapp').find().toArray(function (err, result) {
        console.log('result is ', result);
        res.send(result);
      })
  }); // end of /getNonRiderForms get request
  
  app.get('/getContactForms', function (req,res) {
      db.collection('contactform').find().toArray(function (err, result) {
        console.log('result is ', result);
        res.send(result);
      })
  }); // end of /getContactForms get request
  
  app.get('/getAdmin', function (req,res) {
      db.collection('users').find().toArray(function (err, result) {
        var userInput = JSON.parse(req.query.formData);
        if ((result[0].username === userInput.username) && (result[0].password === userInput.password)){
          console.log('a match, initializing session');
          res.send(result);
        }
        else {
          res.status(500).send('error')
        }  
      })
  }); // end of /getAdmin get request
  
  app.delete('/deleteForm/:formId', function (req,res) {
    console.log('req param', req.params.formId, 'req query', req.query.formType);
      var tableName = req.query.formType;
      var recordId = req.params.formId;
      db.collection(tableName).deleteOne({_id: new mongo.ObjectId(recordId)}, function(err, result){
        console.log('record has been removed, i think');
        res.send(result);
      });
  }); // end of delete request
  
});//end of mongoclient
  
  app.use(allPages, function(req, res){
    res.sendFile(__dirname + '/app/index.html');
  });

  

app.listen(process.env.PORT || 13270);

