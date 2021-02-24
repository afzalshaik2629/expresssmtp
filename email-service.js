var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
/**
 * configure nodemailer with host ,port and credentials
 */
var transporter = nodemailer.createTransport(smtpTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: process.env.email,
      pass: process.env.pass
    }

  }));

    // verify connection configuration
transporter.verify(function(error, success) {
    if (error) {
      console.log('errrr',error);
    } else {
      console.log("Server is ready to take messages");
    }
  });

  module.exports.transporter = transporter;