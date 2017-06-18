var db = require("../models");
var nodemailer = require("./nodeMailer");
const nn = require('nearest-neighbor');
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

  // this route recieves information about the user from the front-end and updates the "about_user" column in the database 
  app.put("/users/aboutuser/", function (req, res) {
    var user = req.body;
    db.User.update({
      about: user.aboutUser
    }, {
      where: {
        name: user.name
      }
    }).then(function (updatedUser) {
      console.log("user successfully updated!");
      console.log(updatedUser);
      return res.json(updatedUser);
    });
  });

  // create a route to update with "about me and user composite matches" 
  // maybe one route for each to avoid crossover? or have option req.params to differentiate 
  app.post("/users/", function (req, res) {
    var user = req.body;
    console.log(user);
    db.User.findAll({
      where: {
        name: user.name,
        email: user.email
      }
    }).then(function (dbUser) {
      console.log("dbUser ", dbUser[0]);
      var userProfile = dbUser[0];
      if (dbUser.length === 0) {
        db.User.create({
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          picture: user.picture,
          last_login: user.last_login
        }).then(function (new_dbUser) {
          console.log('no user found, but user was created!');
          console.log("email successfully sent!");
          // sends email to user after first login! 
          nodemailer(user.email);
          return res.json(new_dbUser);
        });
      } else {

        console.log("user exists");
        // update last login if user exists (user.last_login) property 
        db.User.update({
          last_login: user.last_login
        }, {
          where: {
            name: user.name,
            email: user.email,
          }
        }).then(function (updated_dbUser) {
          console.log("successfully updated user login!");
          // return user profile to client 
          return res.json(userProfile);
        });
      }
    }).catch(function (err) {
      res.send(err);
    });
  });


  app.post("/users/posts/", function (req, res) {
    console.log(req.body);
    db.Posts.create(req.body).then(function (newPost) {
      return res.json(newPost);
    });
  });


  // modify route to include userId 
  app.get("/users/posts/:id", function (req, res) {
    var UserId = req.params.id;
    db.User.findAll({
      where: {
        id: UserId
      },
      include: [{
        model: db.Posts
      }],
      raw: true
    }).then(function (posts) {
      console.log(posts);
      return res.json(posts);
    });
  });


  app.post("/users/friends", function (req, res) {
    // example post request from questionaire: 
    //  {name: "Eyad", scores: [1,3,2,1,2,3,4,3,2,1], UserId: 1}

    var results = req.body;
    var newUser = {
      name: results.name,
      scores: results.scores.map(Number),
      UserId: results.UserId
    };

    db.Scores.findAll({
      include: [{
        model: db.User
      }],
      raw: true
    }).then(function (user) {

      var friendScores = user.map(function (friend) {
        console.log(friend);
        let returnArr = [];
        var x = 0;
        for (var i = 0; i < 10; i++) {
          returnArr.push(friend["Question" + (i + 1)]);
        }
        var friendObj = {};
        // Adding userId to the 10th index to allow for matching via querying the DB 
        friendObj.name = friend["User.name"];
        friendObj.scores = returnArr;
        friendObj.id = friend.UserId;
        return friendObj;
      });

      nn.comparisonMethods.compareScoreArrays = function (a, b) {
        var sumFriend = a.reduce(function (ax, bx) {
          return ax + bx;
        }, 0);
        var sumUser = b.reduce(function (ax, bx) {
          return ax + bx;
        }, 0);
        return (100 - Math.abs(sumUser - sumFriend)) / 100.0
      };

      var fields = [{
        name: "scores",
        measure: nn.comparisonMethods.compareScoreArrays
      }];

      nn.findMostSimilar(newUser, friendScores, fields, function (nearestNeighbor, probability) {
        console.log(nearestNeighbor);
        console.log(probability);
        var nearestId = nearestNeighbor.id;
        var userProbability = probability;
        // add probability column to matches DB 
        // display "Here's your new best friend" and probability 
        // top matches photo: 

        //redo questions page to render dynamically 

        db.User.findAll({
          where: {
            id: nearestId
          }
        }).then(function (bestUser) {
          // console.log("===============================");
          // console.log(bestUser);
          // console.log("===============================");
          var persistMatch = {
            name: bestUser[0].name,
            email: bestUser[0].email,
            picture: bestUser[0].picture,
            about: bestUser[0].about,
            UserId: newUser.UserId
          }
          // console.log("persistMatch", persistMatch);
          db.Matches.create(persistMatch).then(function (bestMatch) {
            // allow for manipulation of returned plain object from sequelize 
            bestMatch = bestMatch.toJSON(); 
            // convert probability from decimal to number 
            bestMatch.probability = probability * 100;
            console.log("===============================");
            console.log("bestMatch.probability", bestMatch.probability);
            console.log("===============================");
            console.log(bestMatch);
            return res.json(bestMatch);
          });
        });
      });
    });
  });



}
