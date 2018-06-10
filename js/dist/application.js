(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.showTable = undefined;

var _database = require("../database");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.showTable = showTable;


var db = new _database2.default();

//**
//* File handling form which allows user to choose apartment he wants to adjust or to show form to create a new apartment.
//* Always only one form of these is visible (!!!)
//**

function addTableRecord(name, address) {
    var lineHtml = "<tr>\n" + "                    <td>" + name + "</td>\n" + "                    <td>" + address + "</td>\n" + "                </tr>";
    $('#apartTable').append(lineHtml);
}

// Show table with all apartments which are linked with logged user
function showTable() {
    $('#apartTable').html("");
    var allAparts = db.getApartsOfLoggedUser();

    allAparts.forEach(function (apartName) {
        addTableRecord(apartName, db.getAddress(apartName));
    });
    $('#changeAppart').show();
}

$('#createAppartBut').on("click", function () {
    $('#changeAppart').hide();
    $('#createAppart').show();
});

$('#backToTable').on("click", function () {
    $('#createAppart').hide();
    showTable();
});

// Creating new apartment.
$('#submitApart').on("click", function () {
    var name = $('#apartname').val().trim();
    var address = $('#apartaddress').val().trim();
    if (name === "" || address === "") {
        $('#errorCreatingApart').text("All fields must be filled.");
    }

    if (db.registerApart(name, address)) {
        showTable();
        $('#createAppart').hide();
    } else {
        $('#errorCreatingApart').text("Apartement with such name already exists.");
    }
});

// Choosing current apartment from table
$('#apartTable').on("click", function (e) {
    var clickedName = $(e.target).parent().children().get(0).innerText;
    localStorage.setObject("curApart", clickedName);
    $('#changeAppart').hide();
    $('#curApartBar').text(clickedName);
});

},{"../database":7}],2:[function(require,module,exports){
"use strict";

var _database = require("./../database");

var _database2 = _interopRequireDefault(_database);

var _apartementsControl = require("./apartementsControl");

var _map = require("./map");

var _todoList = require("./todoList");

var _roommateInvite = require("./roommateInvite");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = new _database2.default();

//**
//* Code which is not unique enough to be in its own file
//**


// If user clicked out of certain forms then I will hide them
$("body").get(0).addEventListener("click", function (e) {
    var $target = $(e.target);
    if (!$target.closest("#appartementForm").length) {
        $('#changeAppart').hide();
    }

    if (!$target.closest("#appartCreateForm").length) {
        $('#createAppart').hide();
    }

    if (!$target.closest("#inviteForm").length) {
        $('#inviteRoommate-layout').hide();
    }

    if ($('#todo-creator-form').is(":visible") && !$target.closest("#todo-creator-form").length) {
        $('#todo-creator').hide();
    }
}, true);

// If no user is "logged in", I will redirect him to index page, where he can sign in or register
if (localStorage.getObject("login") === null) {
    window.location.replace("index.html");
}

// User is logged in. Ok, then I will hide all forms which are not supposed to be seen from the start
localStorage.removeItem("curApart");
$('#createAppart').hide();
$('#todo-creator').hide();
(0, _map.hideMap)();
(0, _todoList.hideTodoList)();
(0, _roommateInvite.hideInvite)();

// If user is not using mobile device I will show him table where he can choose apartment to adjust.
// (I won't be showing anything if he/she is using mobile device)
if (!window.matchMedia('(max-width: 600px)').matches) {
    (0, _apartementsControl.showTable)();
}

},{"./../database":7,"./apartementsControl":1,"./map":3,"./roommateInvite":5,"./todoList":6}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hideMap = exports.showMap = undefined;

var _database = require('../database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.showMap = showMap;
exports.hideMap = hideMap;

//**
//* Asynchronous loading of Seznam maps via seznam maps api.
//**

var db = new _database2.default();
var mapLoadedAlready = false; // Initial variable to describe state
var mapForApart = null; // If curApart and this variable are not the same -> I need to reload map
var defaultCoords = { x: 14.41790, y: 50.12655 }; // Coords for center of Prague, default values

function showMap() {
    if (!mapLoadedAlready || mapForApart !== getCurApartment()) {
        initMap();
    } else {
        $('#map').show(); // Map was already loaded, I can only show her, do not need to make new requests.
    }
}

function initMap() {
    var curAddress = db.getAddressOfCurApart();
    if (curAddress === null) {
        // Apartment was not yet chosen - show Prague.
        Loader.async = true;
        Loader.load(null, null, createMap(defaultCoords));
        return;
    }

    new SMap.Geocoder(curAddress, response); // Make request for coordinates for current address
}

function createMap(coords) {
    $('#map').show();

    var center = SMap.Coords.fromWGS84(coords.x, coords.y);
    var m = new SMap(JAK.gel("map"), center, 13);

    m.addControl(new SMap.Control.Sync({ bottomSpace: 0 }));
    m.addDefaultControls();
    m.addDefaultLayer(SMap.DEF_BASE).enable();

    // If I'm showing valid user address, I add mark pointer on the map for better user experience :D
    if (coords !== defaultCoords) {
        var layer = new SMap.Layer.Marker();
        m.addLayer(layer);
        layer.enable();

        var options = {};
        var marker = new SMap.Marker(center, "Address", options);
        layer.addMarker(marker);
    }

    mapLoadedAlready = true;
    mapForApart = getCurApartment();
}

function response(geocoder) {
    if (!geocoder.getResults()[0].results.length) {
        // Not valid result
        alert("Not valid address. Showing Prague.");
        Loader.async = true;
        Loader.load(null, null, createMap(defaultCoords));
        return;
    }
    try {
        var res = geocoder.getResults()[0].results;
        var resultCoords = void 0;

        // Take first most valid result and show to user in alert what he's going to see on map.
        var data = [];
        var item = res.shift();
        resultCoords = { x: item.coords.x, y: item.coords.y };
        data.push(item.label + " (" + item.coords.toWGS84(2).reverse().join(", ") + ")");

        alert(data.join("\n"));

        Loader.async = true;
        Loader.load(null, null, createMap(resultCoords)); // Finally make request for the map with given coordinates
    } catch (e) {
        alert("Some error occurred. Showing Prague.");
        Loader.async = true;
        Loader.load(null, null, createMap(defaultCoords));
    }
}

function getCurApartment() {
    return localStorage.getObject("curApart");
}

function hideMap() {
    $('#map').hide();
}

},{"../database":7}],4:[function(require,module,exports){
"use strict";

var _database = require("../database");

var _database2 = _interopRequireDefault(_database);

var _apartementsControl = require("./apartementsControl");

var _map = require("./map");

var _todoList = require("./todoList");

var _roommateInvite = require("./roommateInvite");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var db = new _database2.default();

//**
//* This file handles clicking on navigation buttons on navigation top bar
//* Basically on every click all not needed elements are hidden and the required one is shown - see below.
//**

$('#logoutBut').on("click", function () {
    db.logout();
});

// Shows form to choose current apartment to adjust.
$('#changeAppartBut').on("click", function () {
    (0, _todoList.hideTodoList)();
    $('#createAppart').hide();
    (0, _map.hideMap)();
    (0, _roommateInvite.hideInvite)();
    (0, _apartementsControl.showTable)();
});

$('#map-button').on("click", function () {
    // This button works as toggle.
    if ($('#map').is(":visible")) {
        (0, _map.hideMap)();
    } else {
        $('#changeAppart').hide();
        $('#createAppart').hide();
        (0, _todoList.hideTodoList)();
        (0, _roommateInvite.hideInvite)();
        (0, _map.showMap)();
    }
});

$('#todo-list-button').on("click", function () {
    (0, _map.hideMap)();
    (0, _roommateInvite.hideInvite)();
    $('#changeAppart').hide();
    $('#createAppart').hide();
    (0, _todoList.showTodoList)();
});

$('#addRoommateBut').on("click", function () {
    // I cannot add roommate to <non> apartment
    if (localStorage.getObject("curApart") === null) {
        alert("Apartment has to be selected first.");
        return;
    }
    (0, _map.hideMap)();
    (0, _todoList.hideTodoList)();
    $('#changeAppart').hide();
    $('#createAppart').hide();
    (0, _roommateInvite.showInvite)();
});

},{"../database":7,"./apartementsControl":1,"./map":3,"./roommateInvite":5,"./todoList":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hideInvite = exports.showInvite = undefined;

var _database = require('../database');

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.showInvite = showInvite;
exports.hideInvite = hideInvite;


var db = new _database2.default();

//**
//* File handling form which allows logged user to add another user to apartment he's currently adjusting
//* (New user must be already registered! )
//**

function showInvite() {
    $('#inviteRoommate-layout').show();
}

function hideInvite() {
    $('#inviteRoommate-layout').hide();
}

$('#addRoommateConfirm').on("click", function () {
    var roommateName = $('#roommateName').val().trim();

    if (roommateName === "") {
        $('#errorInvitingRoommate').text("Field must be filled.");
    } else if (!db.existsUser(roommateName)) {
        $('#errorInvitingRoommate').text("Such user does not exist.");
    } else {
        db.assignApartToUser(roommateName, localStorage.getObject("curApart"));
        hideInvite();
    }
});

},{"../database":7}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.hideTodoList = exports.showTodoList = undefined;

var _database = require("../database");

var _database2 = _interopRequireDefault(_database);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.showTodoList = showTodoList;
exports.hideTodoList = hideTodoList;


var db = new _database2.default();

//**
//* File handling javascript functionality of to-do cards including its drag and drop functions.
//**

// Show all to-do list which are linked with current apartment being adjusted.
function showTodoList() {
    $('#todo-list-right').html("");

    var curApart = localStorage.getObject("curApart");
    if (curApart === null) {
        // If apartment is not yet chosen, show only layout.
        $('#todo-list-layout').show();
        return;
    }

    var todos = db.getTodosInApart(localStorage.getObject("curApart"));
    todos.forEach(function (todo) {
        showCard(todo.author, todo.text);
    });

    // Every to-do card has dragStart event listener
    $(".todoCard").toArray().forEach(function (elem) {
        elem.addEventListener("dragstart", onStartDragging, false);
    });

    $('#todo-list-layout').show();
}

function hideTodoList() {
    $('#todo-list-layout').hide();
}

// User wants to add new to-do card
$('#plus-symbol').on("click", function () {
    if (localStorage.getObject("curApart") === null) {
        alert("Apartment has to be selected first.");
        return;
    }
    $('#todo-creator').show();
});

// User is creating new to-do card
$('#addTodoConfirm').on("click", function () {
    var $textArea = $('#todoTextArea');
    var todoText = $textArea.val().trim();
    if (todoText === "") return;

    $textArea.text("");
    var author = localStorage.getObject("login");
    db.createNewTodoCard(author, localStorage.getObject("curApart"), todoText);
    showCard(author, todoText);
    $('#todo-creator').hide();
});

// Show certain card in table
function showCard(author, todoText) {
    var createdBy = "<span>" + author + "</span>";
    var text = createdBy + "<br>" + todoText;
    var lineHtml = "<div class=\"todoCard\" draggable='true'>" + text + "</div>";

    $('#todo-list-right').append(lineHtml);

    var allCards = $(".todoCard").toArray();
    allCards[allCards.length - 1].addEventListener("dragstart", onStartDragging, false);
}

function onStartDragging(ev) {
    ev.dataTransfer.setData("text", ev.target.innerHTML);
    console.log(ev.target.innerHTML);
}

var $binDiv = $("#bin-div");

$binDiv.get(0).addEventListener("dragover", function (event) {
    var $bin = $('#bin');
    $bin.removeClass("bin-normal");
    $bin.addClass("bin-draged-over");
    event.preventDefault();
}, false);

$binDiv.get(0).addEventListener("dragleave", function (event) {
    var $bin = $('#bin');
    $bin.removeClass("bin-draged-over");
    $bin.addClass("bin-normal");
    event.preventDefault();
}, false);

$binDiv.get(0).addEventListener("drop", function (event) {
    var $bin = $('#bin');
    $bin.removeClass("bin-draged-over");
    $bin.addClass("bin-normal");

    var toEraseList = event.dataTransfer.getData("text");
    db.eraseTodo(toEraseList, localStorage.getObject("curApart"));
    showTodoList();

    event.preventDefault();
}, false);

},{"../database":7}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FakeDatabase = function () {

    //**
    //* This class fakes database. It uses stringify so it's able to store objects to localStorage.
    //* There is added functionality to localStorage via prototype as you can see in constructor.
    //* Database can register users, apartments, to-do cards (with their author, links to apartment and content) and
    //* maps users to apartments so App can distinguish what apartments are linked with certain user.
    //**
    function FakeDatabase() {
        _classCallCheck(this, FakeDatabase);

        Storage.prototype.setObject = function (key, value) {
            this.setItem(key, JSON.stringify(value));
        };

        Storage.prototype.getObject = function (key) {
            var value = this.getItem(key);
            return value && JSON.parse(value);
        };

        // If app is run for the first time
        if (localStorage.getObject("users") == null) {
            this.initDatabase();
        }
    }

    // Init database with empty values on first run so we do not later get any exception


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

        // Parse information about to-do gained via drag and drop data travel and then remove certain to-do card from db.

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

},{}]},{},[2,1,4,3,5,6]);
