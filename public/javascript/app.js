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

  // handleAuthentication();

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

  function createUserPic(user) { 
    
    var picInfo = user.picture;
    var imgDiv = $('<img>');
    imgDiv.attr('src', picInfo);
    $("#user-picture").append(imgDiv);
  }

  function statusUpdate(user) {
    $('#status').removeClass('hide');
    //animates text box
    $('#textarea1').val('');
    $('#textarea1').trigger(autoresize);
    //on click to get status
    $('#btn').on('click', function() {
      //add to session storage?
      console.log('status updated');
      $('#status').addClass('hide');
    });
    Materialize.toast('Status Updated!', 4000);
  }

  function aboutMe(user) {
    $('#aboutMe').removeClass('hide');
    //animates text box
    $('#textarea2').val('');
    $('#textarea2').trigger(autoresize);
    //on click to get status
    $('#btn').on('click', function() {
      //add to session storage?
      console.log('status updated');
      $('#aboutMe').addClass('hide');
    });
    Materialize.toast('About Me posted!', 4000);
    
  }
 handleAuthentication();

  function handleAuthentication() {
    // wrap function around this 
    webAuth.parseHash(window.location.hash, function (err, authResult) {
      if (err) {
        // amend message to screen telling user to login!! 
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      } else if (authResult && authResult.accessToken && authResult.idToken) {

        console.log(authResult);
        window.location.hash = '';
        setSession(authResult);
        loginBtn.css('display', 'none');
        homeView.css('display', 'inline-block');
        // toggle showing login/logout depending on if the user is authenticated or not
        displayButtons();

        webAuth.client.userInfo(authResult.accessToken, function (err, user) {
          console.log(user);
          console.log(user.email);
          var newUser = {
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
          console.log("retrievedObject ",  retrievedObject); 
          postUserDB(newUser);
          console.log('hi!');
          //activate page
          $('div').removeClass('hide');
          createUserPic(newUser);
          statusUpdate(newUser);
          aboutMe(newUer);
          //carousel
          $(document).ready(function() {
            $('.carousel').carousel();
          });
        });
      }
    });
  }

  function postUserDB(newUser) {

    // all post requests are authenticated before any query is sent to the server 
    isAuthenticated(); 

    $.post("/users/", newUser).then(function (dbUser) {

      console.log("sent via the server", dbUser);

    });
  }

  function submitNewPost() {
    var retrievedObject = JSON.parse(sessionStorage.getItem('currentUser'));

  }

});
