"use strict";

$(document).ready(function () {
  var webAuth = new auth0.WebAuth({
    domain: "ejqassem.auth0.com",
    clientID: "kNpinf_XmKG9ExgzjJTuQrNN60TAoEOn",
    redirectUri: "http://localhost:3000/",
    audience: 'https://' + "ejqassem.auth0.com" + '/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  initHandlers();
  handleAuthentication();

  function initHandlers() {
    // buttons and event listeners
    $('#btn-login').click(function (event) {
      event.preventDefault();
      webAuth.authorize();
    });

    $('#btn-logout').click(logout);
  }

  function setSession(authResult) {
    // Set the time that the access token will expire at
    var expiresAt = JSON.stringify(
      authResult.expiresIn * 1000 + new Date().getTime()
    );
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
  }

  // return to blank screen? 
  // render a blank page 
  function logout() {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    sessionStorage.removeItem('currentUser'); 
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
      $('#btn-login').css('display', 'none');
      $('#btn-logout').css('display', 'inline-block');
      $("#login-status").text('You are logged in!');
    } else {
      $('#btn-login').css('display', 'inline-block');
      $('#btn-logout').css('display', 'none');
      $("#login-status").text('Please login to continue!.');
    }
  }

<<<<<<< HEAD
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

=======
>>>>>>> 970d141fefbb546389da173990b243ec337616ee
  function handleAuthentication() {
    // wrap function around this 
    webAuth.parseHash(window.location.hash, function (err, authResult) {
      if (err) {
        // amend message to screen telling user to login or re-login since their token expired!! 
        console.log(err);
        alert(
          'Error: ' + err.error + '. Check the console for further details.'
        );
      } else if (authResult && authResult.accessToken && authResult.idToken) {

        window.location.hash = '';
        setSession(authResult);
        $('#btn-login').css('display', 'none');
        // toggle showing login/logout depending on if the user is authenticated or not
        displayButtons();

        webAuth.client.userInfo(authResult.accessToken, function (err, user) {
          console.log(user);
          var newUser = {
            email: user.email,
            name: user.name,
            nickname: user.nickname,
            picture: user.picture,
            provider: user.sub,
            last_login: user.updated_at,
          }

          // send recieved user Object to database after authentication via auth0 
          postUserDB(newUser);
<<<<<<< HEAD
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
=======

          // renderUserProfile(newUser); 

>>>>>>> 970d141fefbb546389da173990b243ec337616ee
        });
      }
    });
  } 

  // function renderUserProfile(newUser) {
  //   var userImage = $("<img>"); 
  //   userImage.attr("src", newUser.picture); 
  //   $("#user-picture").append(userImage); 
  // }

  function postUserDB(newUser) {

    // all HTTP requests are authenticated before any query is sent to the server 
    isAuthenticated();

    $.post("/users/", newUser).then(function (dbUser) {

      // Put the user object into session storage for future reference 
      sessionStorage.setItem('currentUser', JSON.stringify(dbUser));
      var retrievedObject = JSON.parse(sessionStorage.getItem('currentUser'));
      console.log("retrieved Object ", retrievedObject);
    });

  }

  function submitNewPost() {
    // all HTTP requests are authenticated before any query is sent to the server 
    isAuthenticated();

    // referencing current user object to grab unique id used to associate Posts with User(foreignKey)
    var retrievedObject = JSON.parse(sessionStorage.getItem('currentUser'));

    // var postTitle = $("#title-post").val().trim(); 
    // var postBody = $("#body-post").val().trim(); 
    // new post to server must follow following guidelines: 
    // newPost = {
    //   title: postTitle, 
    //   body: postBody, 
    //   "UserId": retrievedObject.id
    // }

    $.post("/user/posts/", newPost).then(function (result) {
      console.log(result);
    });
  }

  function getPosts() {
    // referencing current user object to grab unique id used to associate Posts with User(foreignKey)
    var retrievedObject = JSON.parse(sessionStorage.getItem('currentUser'));
    var UserId = retrievedObject.id;
    $.get("/users/posts" + UserId).then(function (allPosts) {
      // render all posts to page 
    });
  }
});
