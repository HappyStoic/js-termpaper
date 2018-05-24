(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

window.location.hash = '#intro';

function showErrorUnderSignIn(text) {
    $('#errorSignIn').text(text);
}

function showErrorUnderSignUp(text) {
    $('#errorSignUp').text(text);
}

function signInButtonClicked() {
    var username = $('#usernameLogin').val();
    var password = $('#passwordLogin').val();

    //TODO error all fields must be filled
    showErrorUnderSignIn("Error clicking on button sign in");
}

function signUpButtonClicked() {
    var username = $('#usernameRegister').val();
    var password1 = $('#passwordRegister1').val();
    var password2 = $('#passwordRegister2').val();

    if (password1 !== password2) {
        showErrorUnderSignUp("Provided passwords are not the same.");
        return;
    }

    showErrorUnderSignUp("Error clicking on button sign up");
}

$('#signInButton').on("click", function () {
    return signInButtonClicked();
});
$('#signUpButton').on("click", function () {
    return signUpButtonClicked();
});

},{}]},{},[1]);
