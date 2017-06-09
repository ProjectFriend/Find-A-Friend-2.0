"use strict";

$('document').ready(function () {

  // modularize code to operate on button click, not document.ready() 
  // review what handleAuthentication does and try to keep initial error from appearing about token 


  // updated user database to include facebook/google email for 
  // node mailer? to show that the user logged in? 
  // should we stick to only authenticating facebook to avoid 
  // cross-over issues 
  var webAuth = new auth0.WebAuth({
    domain: "ejqassem.auth0.com",
    clientID: "kNpinf_XmKG9ExgzjJTuQrNN60TAoEOn",
    redirectUri: "http://localhost:3000/",
    audience: 'https://' + "ejqassem.auth0.com" + '/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  // buttons and event listeners
  var homeViewBtn = $('#btn-home-view');
  var loginBtn = $('#btn-login');
  var logoutBtn = $('#btn-logout');

  var loginStatus = $('.container h4');
  var loginView = $('#login-view');
  var homeView = $('#home-view');

  homeViewBtn.click(function () {
    homeView.css('display', 'inline-block');
    loginView.css('display', 'none');
  });

  loginBtn.click(function (event) {
    event.preventDefault();
    webAuth.authorize();
  });

  logoutBtn.click(logout);

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    displayButtons();
  }

  // checks to verify user is logged in? Maybe do this before any 
  // calls to the server 
  function isAuthenticated() {
    // Check whether the current time is past the
    // access token's expiry time
    var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }

  function handleAuthentication() {
    webAuth.parseHash(function (err, authResult) {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        setSession(authResult);
        loginBtn.css('display', 'none');
        homeView.css('display', 'inline-block');
      } else if (err) {
        homeView.css('display', 'inline-block');
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      }
      displayButtons();
    });
  }

  function displayButtons() {
    if (isAuthenticated()) {
      loginBtn.css('display', 'none');
      logoutBtn.css('display', 'inline-block');
      loginStatus.text('You are logged in!');
    } else {
      loginBtn.css('display', 'inline-block');
      logoutBtn.css('display', 'none');
      loginStatus.text('You are not logged in! Please log in to continue.');
    }
  }

  handleAuthentication();

  // wrap function around this 
  function parseHash() {
    webAuth.parseHash(window.location.hash, function (err, authResult) {
      if (err) {
        return console.log(err);
      }
      console.log(authResult);
      // var id_token = authResult.idToken; 
      webAuth.client.userInfo(authResult.accessToken, function (err, user) {
        // This method will make a request to the /userinfo endpoint 
        // and return the user object, which contains the user's information, 
        // similar to the response below.
        // console.log("user.user_id " , user.user_id);
        // console.log("user_id ", user_id); 
        console.log(user);
        console.log(user.email);
        var newUser = {
          // id_token: id_token, 
          email: user.email,
          name: user.name,
          nickname: user.nickname,
          picture: user.picture,
          provider: user.sub,
          last_login: user.updated_at,
        }

        // Put the object into storage
        sessionStorage.setItem('currentUser', JSON.stringify(newUser));

        // Retrieve the object from storage
        var retrievedObject = JSON.parse(sessionStorage.getItem('currentUser'));


        // store user in session/local storage for future post requests? 
        //composite score
        //updating their "about me""
        //request to database to compare user scores to others  
        //connecting with other users
        $.post("/users/", newUser).then(function (dbUser) {

          // need to store user data in database
          // grab user photo to post on page 
          // associate blog posts with user data 
          // maybe pick only one social media site to authorize??? 
          // render web-page here using user information 
          // why exactly should we have multiple tables? 
          // think of ways to split up database? Ask ryo/leo for input
          console.log("sent via the server", dbUser);
          console.log("successfully sent user info to server!");

         

        });

      });
    });
  }

});
