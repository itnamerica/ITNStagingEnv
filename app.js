var express = require('express');
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var app = express();
const MongoClient = require('mongodb').MongoClient
var env = require(__dirname + '/env-vars.js');
var gmail_login = env.gmail_login;
var gmail_pass = env.gmail_pass;
var db;

app.use(express.json()); //convert req to json
app.use(express.static(__dirname + '/app'));


var allPages = ['/home','/what-we-do','/organization','/faces','/faq','/news','/contact','/become-member','/member-app','/volunteer-to-drive','/volunteer-app','/family','/member-programs','/pay-online','/donate','/corporate'];

app.use(allPages, function(req, res){
  res.sendFile(__dirname + '/app/index.html');
});


MongoClient.connect('mongodb://itnadmin:itnUser0136!@ds263639.mlab.com:63639/itnamerica', function(err, client) {
  if (err) { console.log(err)};

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
      console.log('sending email with pdf');
      mailOptions = {
          from: req.body.from, // sender address
          to: req.body.to, // list of receivers
          subject: req.body.subject, // Subject line   
          text: JSON.stringify(req.body.text), // plain text body
          // bcc: 'info@itnlanier.org',
          attachments: [{path: req.body.pdf}]
      };
      
      db.collection('memberapp').save(req.body, (err, result) => {
        if (err) return console.log(err)

        console.log('member app saved to database')
        res.redirect('/')
      })
      
    }
    else if (req.body && req.body.html){
      console.log('sending email without pdf');
      mailOptions = {
          from: req.body.from, // sender address
          to: req.body.to, // list of receivers
          subject: req.body.subject, // Subject line   
          text: JSON.stringify(req.body.text), // plain text body
          // bcc: 'info@itnlanier.org',
          html: req.body.html // html body
      };
    } else {
      console.log('sending email with neither');
      mailOptions = {
          from: req.body.from, // sender address
          to: req.body.to, // list of receivers
          subject: req.body.subject, // Subject line   
          text: JSON.stringify(req.body.text), // plain text body
          // bcc: 'info@itnlanier.org',
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
      
      app.get('/*', function(req, res) { 
        console.log('redirecting index');
        // res.sendFile(__dirname + '/index.html')
        res.sendFile(__dirname + '/app/contact.html')
      });
  git
    
    res.end();
  });




  // MongoClient.connect('mongodb://itnadmin:itnUser0136!@ds263639.mlab.com:63639/itnamerica', (err, client) => {
  //   if (err) return console.log(err)
  //   db = client.db('itnamerica') // whatever your database name is
  //   // app.listen(3000, () => {
  //   //   console.log('listening on 3000')
  //   // })
  // 
  //   app.post('/sendmail2', (req, res) => {
  //     db.collection('memberapp').save(req.body, (err, result) => {
  //       if (err) return console.log(err)
  // 
  //       console.log('member app saved to database')
  //       res.redirect('/')
  //     })
  //   })
  // 
  //   app.listen(process.env.PORT || 13270);
  // })

  app.listen(process.env.PORT || 13270);
})
