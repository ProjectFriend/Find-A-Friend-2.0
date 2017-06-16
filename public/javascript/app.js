"use strict";

$(document).ready(function () {
  var webAuth = new auth0.WebAuth({
    domain: "ejqassem.auth0.com",
    clientID: "kNpinf_XmKG9ExgzjJTuQrNN60TAoEOn",
    redirectUri: "https://habibi-demo.herokuapp.com/",
    audience: 'https://' + "ejqassem.auth0.com" + '/userinfo',
    responseType: 'token id_token',
    scope: 'openid profile email'
  });

  hideBeforeLoginScreen();
  handleAuthentication();
  initHandlers();

  function hideBeforeLoginScreen() {
    $("#after-login-screen").hide();
    $("#user-about-me").hide();
    $("#user-posts").hide();
    $("#survey-btns-div").hide();
    $(".page-footer").hide();
  }

  function showAfterLoginScreen() {
    $("#welcome-screen").hide();
    $('html').css('background-image', 'none').css('background-color', '#515052');
    $("#after-login-screen").show();
    $("#user-about-me").show();
    $("#user-posts").show();
    $("#survey-btns-div").show();
    $(".page-footer").show();
  }

  function initHandlers() {
    // buttons and event listeners
    $('.btn-login').click(function (event) {
      event.preventDefault();
      webAuth.authorize();
    });
    $('.btn-logout').click(logout);
    $("#submit-new-post").on("click", submitNewPost);
    $("#submit-new-about").on("click", submitAboutUser);
    $(".button-collapse").sideNav();
    $("#submitbutton").on("click", submitQuestionaire);
    $(".tabs").tabs({
      onShow: function (tab) {
        $(".carousel").carousel();
      }
    })
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
      $('.btn-login').css('display', 'none');
      $('.btn-logout').css('display', 'inline-block');
      $("#login-status").text('You are logged in!');
    } else {
      $('.btn-login').css('display', 'inline-block');
      $('.btn-logout').css('display', 'none');
      $("#login-status").text('Please login to continue!');
    }
  }


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
        $('.btn-login').css('display', 'none');
        // toggle showing login/logout depending on if the user is authenticated or not
        displayButtons();

        webAuth.client.userInfo(authResult.accessToken, function (err, user) {
          console.log(user);
          var newUser = {
            email: user.email,
            name: user.name,
            nickname: user.nickname,
            picture: user.picture,
            last_login: user.updated_at,
          }

          // send recieved user Object to database after authentication via auth0 
          postUserDB(newUser);

        });
      }
    });
  }

  // renderUserProfile(newUser); 
  function renderUserProfile(userImage) {
    showAfterLoginScreen();
    // runs AJAX get request to get all of the logged in user's posts 
    getPosts(function (userPosts) {
      for (var i = 0; i < userPosts.length; i++) {
        var currentPost = JSON.parse(JSON.stringify(userPosts[i]));

        var newPost = $("<li>");
        newPost.attr("class", "flow-text collection-item");
        var newPostBody = currentPost["Posts.body"];
        newPost.append(newPostBody);
        $("#user-posts-here").append(newPost);
      }
      var singlePost = JSON.parse(JSON.stringify(userPosts[0]));
      var aboutUser = singlePost["about"];
      console.log(aboutUser);
      $('#about-user').val(aboutUser);
      $('#about-user').trigger('autoresize');
      Materialize.updateTextFields();

      var userName = $("<h5>");
      userName.attr("class", "current-user-name ");
      userName.append(singlePost["name"]);
      $("#user-name").append(userName);
    });


    var profileImage = $("<img>");
    profileImage.attr({
      "src": userImage,
      "class": "responsive-img materialboxed center"
    });
    $("#user-image").append(profileImage);

  }

  function postUserDB(newUser) {

    // all HTTP requests are authenticated before any query is sent to the server 
    isAuthenticated();

    $.post("/users/", newUser).then(function (dbUser) {

      // Put the user object into session storage for future reference 
      sessionStorage.setItem('currentUser', JSON.stringify(dbUser));
      var retrievedObject = JSON.parse(sessionStorage.getItem('currentUser'));
      console.log("retrieved Object ", retrievedObject);
      console.log(retrievedObject.picture);
      var userImage = retrievedObject.picture;
      console.log(userImage);
      renderUserProfile(userImage);
    });
  }

  function submitNewPost() {
    // all HTTP requests are authenticated before any query is sent to the server 
    isAuthenticated();

    // referencing current user object to grab unique id used to associate Posts with User(foreignKey)
    var retrievedObject = JSON.parse(sessionStorage.getItem('currentUser'));
    console.log(retrievedObject.id);
    console.log("Post submitted!");
    var postBody = $("#post-body").val().trim();
    // empty out form after submission 
    $("#post-body").val("");
    // new post to server must follow following guidelines: 
    var newPost = {
      body: postBody,
      UserId: retrievedObject.id
    }

    // attaches current status next to user image 
    $("#current-status-text").text("");
    var newPostText = postBody;
    $("#current-status-text").append(newPostText);

    $.post("/users/posts/", newPost).then(function (result) {
      console.log(result);
    });
  }

  function getPosts(callback) {
    // referencing current user object to grab unique id used to associate Posts with User(foreignKey)
    var retrievedObject = JSON.parse(sessionStorage.getItem('currentUser'));
    var UserId = retrievedObject.id;
    var userPosts;
    $.ajax({
      url: "/users/posts/" + UserId,
      method: "GET"
    }).done(function (result) {
      userPosts = result;
      return callback(userPosts);
    });
  }

  function submitAboutUser() {
    var retrievedObject = JSON.parse(sessionStorage.getItem('currentUser'));
    var userName = retrievedObject.name;
    var aboutUser = $("#about-user").val().trim();
    var id = retrievedObject.id;
    console.log(aboutUser);
    var updateUser = {
      aboutUser: aboutUser,
      name: userName,
      UserId: id
    }
    $.ajax({
      url: "/users/aboutuser/",
      method: "PUT",
      data: updateUser
    }).done(function (result) {
      console.log(result);
    });
  }


  function submitQuestionaire() {
    var answers = $("input:radio:checked").map(function () {
      return (this.value);
    }).get();
    var retrievedObject = JSON.parse(sessionStorage.getItem('currentUser'));
    var id = retrievedObject.id;
    var name = retrievedObject.name
    var newUser = {
      name: name,
      UserId: id,
      scores: answers
    }
    console.log(newUser)
    $.post("/users/friends", newUser).then(function(results) {
      console.log(results);
      console.log("picture: ", results[0].picture);
      $("#top-matches").empty();
      var slider = $('.carousel');
      slider.carousel();
      if (slider.hasClass('initialized')) {
        slider.removeClass('initialized')
      }
      for (var i = 0; i < 3; i++) {
        var newMatch = $("<a>");
        newMatch.attr({
          class: "carousel-item",
          href: function () {
            if (i === 0) {
              return "#one!"
            } else if (i === 1) {
              return "#two!"
            } else if (i === 2) {
              return "#three"
            }
          },
        });
        var newImg = $("<img>");
        newImg.attr("src", results[i].picture);
        newMatch.append(newImg);
        $("#top-matches").append(newMatch);
      }
      $("#opposite-matches").empty();
      for (var i = 4; i < 7; i++) {
        var newMatch = $("<a>");
        newMatch.attr({
          class: "carousel-item",
          href: function () {
            if (i === 4) {
              return "#one!"
            } else if (i === 5) {
              return "#two!"
            } else if (i === 6) {
              return "#three"
            }
          },
        });
        var newImg = $("<img>");
        newImg.attr("src", results[i].picture);
        newMatch.append(newImg);
        $("#opposite-matches").append(newMatch);
      }
      slider.carousel();
    });
  }


});