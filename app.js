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

app.use(express.json()); //convert req to json
app.use(express.static(__dirname + '/app'));


var allPages = ['/home','/what-we-do','/organization','/faces','/faq','/news','/contact','/become-member','/member-app','/volunteer-to-drive','/volunteer-app','/family','/member-programs','/pay-online','/donate','/corporate','dashboard','login'];

app.use(allPages, function(req, res){
  res.sendFile(__dirname + '/app/index.html');
});

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
    MongoClient.connect('mongodb://itnadmin:itnUser0136!@ds263639.mlab.com:63639/itnamerica', function(err, client) {
      if (err) { 
        console.log('db not connecting, but inside mongo block', err);
      };
      db = client.db('itnamerica');
      
      if ((req.body && req.body.pdf) && (req.body.formType === 'membership')) {
        db.collection('memberapp').save(req.body.text, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err); }
          console.log('member app saved to database', result);
          res.redirect('/');
        })
      }
      else if ((req.body && req.body.pdf) && (req.body.formType === 'volunteer')) {
        db.collection('volunteerapp').save(req.body.text, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('volunteer app saved to database', result);
          res.redirect('/');
        })
      }
      else if ((req.body && req.body.pdf) && (req.body.formType === 'nonrider')) {
        db.collection('nonriderapp').save(req.body.text, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('nonrider app saved to database', result);
          res.redirect('/');
        })
      }
      else if (req.body && req.body.html) {
        db.collection('contactform').save(req.body.text, function(err, result){
          if (err) { return console.log('connecting to db, but not saving obj', err);}
          console.log('contact form saved to database', result);
          res.redirect('/');
        })
      }

    });
    
    console.log('after mongo block');
    res.end();
  }); // end /sendmail post request
  
  app.get('/getMemberForms', function (req,res) {
    db.collection('memberapp', function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log(items);
            res.send(items);
        });
    });
     // res.send('Hello');
  });
  

app.listen(process.env.PORT || 13270);

