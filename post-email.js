const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3010;

var poolObj = require('./db-connection').pool;
var transporterObj = require('./email-service').transporter;
var triggerEmailsObj = require('./email-scheduler');
app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/** postEmail method to add email address in the db */
app.post('/postEmail', (req, res) => {
    var emailId = req.body.email;
    /** validate emailId */
    if (ValidateEmailId(emailId)) {
        /** make a connection and use insert query to add email address */
        poolObj.then(conn => {
            conn.query('INSERT INTO test.users(emailId) value (?)', [emailId])
                .then(rows => {
                    /** sendRegisteredEmail method to send registered emails */
                    sendRegisteredEmail(emailId)
                   
                    //conn.end();
                })
                .catch(err => {
                });
        })
        /**
         * success message for registered email
         */
        var respObj = {
            response: {
            statusCode : 200,
            message : 'Email is added successfully.'
            }
        }
           
        res.send(respObj);
    } else {
        /** error for invalid emailId */
        var error = new Error();
        error.error = {};
        error.error.statusCode = 400;
        error.error.requestStatus = false;
        error.error.error = 'You have entered an invalid email address!'
        res.send(error)
    }

});

app.listen(port, () => console.log(`triggerpoc app listening on port ${port}!`));
/**
 * cron job
 */
triggerEmailsObj.triggerNotification();

/**
 * validateEmailId method to validate emailId
 */
function ValidateEmailId(mail) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(mail)) {
        return (true)
    }
    return (false)
}

/**
 * sendRegisteredEmail method to trigger for every successful email registration
 */
function sendRegisteredEmail(email) {

    var options = {
        type: 'email',
        to: email,
        from: process.env.email,
        subject: 'Test Email.',
        html: 'Hello ' + '<br>' + '<br>' +
          'Your are successfull registered for triggerpoc' + '<br>' + '<br>' 
      }

      transporterObj.sendMail(options);

}