var nodemailer = require("nodemailer");
var send = require("gmail-send");

module.exports = function (newUserEmail) {
  'use strict';
  var send = require('gmail-send')({
    user: 'habbibi.friendapp@gmail.com', // Your GMail account used to send emails 
    pass: 'habbibifriendapp', // Application-specific password 
    to: newUserEmail, // Send to yourself 
    // you also may set array of recipients:  
    // [ 'user1@gmail.com', 'user2@gmail.com' ] 
    subject: 'Welcome to Habbibi App',
    text: 'You have signed up for Habbibi App! Happy matching :)' // Plain text 
  })(); // Send without any check 
}
