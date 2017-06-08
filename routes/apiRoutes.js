var db = require("../models");
var fs = require("fs");

/* Randomize array element order in-place. 
       Using Durstenfeld shuffle algorithm. */
function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

module.exports = function (app) {
  // function will be used after user logs in
  // get request to users to find user using req.params.user 
  // app.get("/users/:user?", function (req, res) {
  //   db.User.findAll({}).then(function (user) {
  //     return res.json(user);
  //   });
  // });

  app.get("/api/loveques", function (req, res) {
    var loveQuestions = require("../questions/loveQuestions");
    loveQuestions = shuffleArray(loveQuestions);
    return res.send(loveQuestions);
  });

  app.get("/api/friendques", function (req, res) {
    var friendQuestions = require("../questions/friendQuestions");
    friendQuestions = shuffleArray(friendQuestions);
    return res.json(friendQuestions);
  });

  app.get("/api/both", function (req, res) {
    var loveQuestions = require("../questions/loveQuestions");
    var friendQuestions = require("../questions/friendQuestions");
    var both = friendQuestions.concat(loveQuestions);
    both = shuffleArray(both);
    return res.json(both);
  });

  // create a route to update with "about me and user composite matches" 
  // maybe one route for each to avoid crossover? or have option req.params to differentiate 
  app.post("/users/", function (req, res) {
    console.log(user);
    var user = req.body;
    // console.log(user); 
    db.User.findAll({
      where: {
        name: user.name,
        email: user.email
      }
    }).then(function (dbUser) {

      if (dbUser.length === 0) {
        db.User.create({
          // id_token: user.id_token, 
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          picture: user.picture,
          provider: user.sub,
          last_login: user.last_login
        }).then(function (dbUser) {
          console.log('no user found, but user was created!');
          return res.json(dbUser);
        });
      } else {
        console.log("user exists");
        // update last login if user exists (user.last_login) property 


        // res.redirect(/users/:user.name) and render a page based on user information? 
        // use url to make a get request to page to render user page and go from there to render particular infomration 

        // maybe embed the get request inside the post request to populate the page correctly with user information 
        return res.json(dbUser);
      }
    }).catch(function (err) {
      res.send(err);
    });
  });
}

//implement nodemailer package on signup to send user email after logging in to app 
// "Welcome to Habbibi"
