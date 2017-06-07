var db = require("../models");

module.exports = function (app) {
  app.get("/users/:user?", function (req, res) {
    db.User.findAll({}).then(function (user) {
      return res.json(user);
    });
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
    }).catch(function(err) {
      res.send(err); 
    });
  });
}
