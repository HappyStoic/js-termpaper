(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FakeDatabase = function () {
    function FakeDatabase() {
        _classCallCheck(this, FakeDatabase);

        Storage.prototype.setObject = function (key, value) {
            this.setItem(key, JSON.stringify(value));
        };

        Storage.prototype.getObject = function (key) {
            var value = this.getItem(key);
            return value && JSON.parse(value);
        };

        if (localStorage.getObject("users") == null) {
            this.initDatabase();
        }
    }

    _createClass(FakeDatabase, [{
        key: "initDatabase",
        value: function initDatabase() {
            var emptyObject = {};
            var emptyArray = [];
            localStorage.setObject("users", emptyObject);
            localStorage.setObject("aparts", emptyObject);
            localStorage.setObject("usersToAparts", emptyObject);
            localStorage.setObject("todos", emptyArray);
        }
    }, {
        key: "registerUser",
        value: function registerUser(name, password) {
            var users = this._getAllUsers();
            if (users[name] !== undefined) {
                return false;
            }

            var usersToAparts = this._getAllUsersToAparts();
            usersToAparts[name] = [];

            users[name] = { 'password': password };
            localStorage.setObject("users", users);
            localStorage.setObject("usersToAparts", usersToAparts);
            return true;
        }
    }, {
        key: "loginUser",
        value: function loginUser(name, password) {
            var users = this._getAllUsers();
            if (users[name] === undefined) return false;else if (users[name].password === password) {
                localStorage.setObject("login", name);
                return true;
            }
            return false;
        }
    }, {
        key: "logout",
        value: function logout() {
            localStorage.removeItem("login");
            localStorage.removeItem("curApart");
        }
    }, {
        key: "isLogin",
        value: function isLogin() {
            return localStorage.getObject("login") !== null;
        }
    }, {
        key: "registerApart",
        value: function registerApart(name, address) {
            var allAparts = this._getAllAparts();
            if (allAparts[name] !== undefined) {
                return false;
            }
            this.assignApartToUser(localStorage.getObject("login"), name);
            allAparts[name] = { "address": address };
            localStorage.setObject("aparts", allAparts);
            return true;
        }
    }, {
        key: "getAddressOfCurApart",
        value: function getAddressOfCurApart() {
            var curApart = localStorage.getObject("curApart");
            if (curApart === null) return null;else return this._getAllAparts()[curApart].address;
        }
    }, {
        key: "getApartsOfLoggedUser",
        value: function getApartsOfLoggedUser() {
            var login = localStorage.getObject("login");
            var usersToAparts = this._getAllUsersToAparts();
            return usersToAparts[login];
        }
    }, {
        key: "_getAllAparts",
        value: function _getAllAparts() {
            return localStorage.getObject("aparts");
        }
    }, {
        key: "_getAllUsers",
        value: function _getAllUsers() {
            return localStorage.getObject("users");
        }
    }, {
        key: "_getAllUsersToAparts",
        value: function _getAllUsersToAparts() {
            return localStorage.getObject("usersToAparts");
        }
    }, {
        key: "_getAllTodos",
        value: function _getAllTodos() {
            return localStorage.getObject("todos");
        }
    }, {
        key: "existsUser",
        value: function existsUser(username) {
            var users = this._getAllUsers();
            return users[username] !== undefined;
        }
    }, {
        key: "assignApartToUser",
        value: function assignApartToUser(username, apartname) {
            var usersToAparts = this._getAllUsersToAparts();
            var userAparts = usersToAparts[username];
            if (!userAparts.includes(apartname)) {
                userAparts.push(apartname);
                localStorage.setObject("usersToAparts", usersToAparts);
            }
        }
    }, {
        key: "getAddress",
        value: function getAddress(apartment) {
            return this._getAllAparts()[apartment].address;
        }
    }, {
        key: "createNewTodoCard",
        value: function createNewTodoCard(author, apart, content) {
            var newCard = { "apart": apart, "author": author, "text": content };
            var todos = this._getAllTodos();
            todos.push(newCard);
            localStorage.setObject("todos", todos);
        }
    }, {
        key: "getTodosInApart",
        value: function getTodosInApart(apartment) {
            return this._getAllTodos().filter(function (todo) {
                return todo.apart === apartment;
            });
        }
    }, {
        key: "eraseTodo",
        value: function eraseTodo(text, apart) {
            var content = text.substring(text.indexOf("<br>") + 4, text.length);
            var author = $(text).filter("span").get(0).innerText;

            var todos = this._getAllTodos();
            for (var i = 0; i < todos.length; i++) {
                var todo = todos[i];
                if (todo.apart === apart && todo.author === author && todo.text === content) {
                    todos.splice(i, 1);
                    break;
                }
            }
            localStorage.setObject("todos", todos);
        }
    }]);

    return FakeDatabase;
}();

exports.default = FakeDatabase;

},{}],2:[function(require,module,exports){
'use strict';

var _database = require('./database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

(function () {
    var database = new _database2.default();

    if (database.isLogin()) {
        window.location.replace("application.html");
    } else {
        window.location.hash = '#intro';
    }

    function showErrorUnderSignIn(text) {
        $('#errorSignIn').text(text);
    }

    function showErrorUnderSignUp(text) {
        $('#errorSignUp').text(text);
    }

    $('#signInButton').on("click", function () {
        return signInButtonClicked();
    });
    $('#signUpButton').on("click", function () {
        return signUpButtonClicked();
    });

    function signInButtonClicked() {
        var username = $('#usernameLogin').val().trim();
        var password = $('#passwordLogin').val().trim();

        if (username === "" || password === "") {
            showErrorUnderSignIn("All fields must be filled.");
        } else if (!database.loginUser(username, password)) {
            showErrorUnderSignIn("Input wrong username or password.");
        } else {
            window.location.replace("application.html");
        }
    }

    function signUpButtonClicked() {
        var username = $('#usernameRegister').val().trim();
        var password1 = $('#passwordRegister1').val().trim();
        var password2 = $('#passwordRegister2').val().trim();

        if (username === "" || password1 === "" || password2 === "") {
            showErrorUnderSignUp("All fields must be filled.");
            return;
        }
        if (password1 !== password2) {
            showErrorUnderSignUp("Provided passwords are not the same.");
            return;
        }
        if (database.registerUser(username, password1)) {
            window.location.hash = '#signinPart';
        } else {
            showErrorUnderSignUp("Username already exists.");
        }
    }
})();

},{"./database":1}]},{},[2]);
