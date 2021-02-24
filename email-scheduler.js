const schedule = require('node-schedule');
var poolObj = require('./db-connection').pool;
var listOfEmails = [];
var list = [];
var transporterObj = require('./email-service').transporter;
/** getEmails() method to get list of emails using connection pool */
function getEmails() {
poolObj.then(conn => {
    conn.query('SELECT * FROM test.users')
        .then(rows => {
            listOfEmails = JSON.stringify(rows);
            list = JSON.parse(listOfEmails)
            // conn.end();
        })
        .catch(err => {
        });
})
}

/** cron job which get called every 10 seconds */
function triggerNotification() {
    schedule.scheduleJob("*/10 * * * * *", function() {
        console.log('This runs every 10 seconds');
        /** get list of emails which are already registered */
        getEmails();
        /** loop and send email to every registered email */
        for (let index in list) {
            sendRegisteredEmail(list[index]['emailId'])

          }
       
    });

}

/** method which sends email */
function sendRegisteredEmail(email) {
/** email object with to , from content and subject  */
    var options = {
        type: 'email',
        to: email,
        from: process.env.email,
        subject: 'Test Email.',
        html: 'Hello ' + '<br>' + '<br>' +
          'Triggering notification for every 10 seconds' + '<br>' + '<br>' 
      }
      /** method to trigger email */
      transporterObj.sendMail(options);

}

module.exports.getEmails = getEmails;
module.exports.triggerNotification = triggerNotification;